const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const notifier = require('../controllers/notifier.js');
const Mail = require('../models/MailDB');
const { ensureAuthenticated } = require("../config/auth");


/**
 * @route   POST /api/notify/
 * @desc    Create a new job
 * @access  Private
 */

router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        let userID = req.user._id;

        const maildata = new Mail({
            userID: userID,
            to: req.body.to,
            cc: req.body.cc,
            schTime: req.body.schTime,
            schUnit: req.body.schUnit,
            subject: req.body.subject,
            mailBody: req.body.mailBody,
            isHome: true,
            date: Date.now()
        });
        let saved = await maildata.save();

        if (!saved) res.status(400).render("error/400");
        else res.status(201).redirect("/dashboard");
    } catch (e) {
        console.log(e);
        res.status(500).render("error/500");
    }
});


/**
 * @route   GET api/notify/schedule/:id
 * @desc    Schedule a job
 * @access  Private
 */

router.get('/schedule/:id', ensureAuthenticated, async (req, res) => {
    try {

        let patch = await Mail.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: { isHome: false , date: Date.now()} },
            { new: true, useFindAndModify: false }
        );

        if (!patch) res.status(404).render("error/404");

        /*--- makeing the schedule string ---*/
        let schedule = "* * * * * *";

        let timeObj = { 
                "sec" :  0,
                "min" :  2,
                "hour":  4,
                "date":  6,
                "mon":   8,
                "day":  10
            };

        let index = timeObj[patch.schUnit], cronTime ="";

        let key = patch.schTime;
        if(index === 10) key -= 1;

        for(let i = 0; i<=10; i++){
            if(i === index) {
                if(key == 0){
                    cronTime +=  "0";
                    continue;
                }
                cronTime += `*/${key}`;
                continue;
            }
            if(i < index && i%2 === 0) {
                if(i === 6 || i === 8){
                    cronTime+="1";
                    continue;
                }
                cronTime+= "0";
                continue;
            }
            cronTime+= schedule[i];
        }
        /*--------------------------*/
        console.log(cronTime);

        cron.schedule(cronTime, async () => {

            await notifier.sendEmail(
                patch.to,
                patch.cc,
                patch.subject,
                patch.mailBody,
                (err, result) => {
                    if (err) {
                        console.error({ err });
                    }
                });
        });
        res.redirect("/dashboard");
    } catch (e) {
        console.error('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
});



router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        let mailData = await Mail.findById({ _id: req.params.id }).lean();
        if (!mailData) {
            return res.status(404).render("error/404");
        }
        else {
            console.log("EDIT");
            console.log(mailData);
            res.render("edit", { mailData });
        }
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});



router.get('/show/:id', ensureAuthenticated, async (req, res) => {
    try {
        let mailData = await Mail.findById({ _id: req.params.id }).lean();
        if (!mailData) {
            return res.render("error/404");
        }
        else {
            console.log("SHOW");
            console.log(mailData);
            res.render("show", {
                title: mailData.subject,
                date: mailData.date,
                mailBody: mailData.mailBody
            });
        }
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        let mailData = await Mail.findById({ _id: req.params.id });
        if (!mailData) {
            return res.render("error/404");
        }
        else {
            mailData = await Mail.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            });
            res.redirect("/dashboard");
        }
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Mail.remove({ _id: req.params.id });
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});


module.exports = router;