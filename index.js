//core modules 
const path = require('path');

//third-party  modules 
const express = require('express');
const bodyParser = require('body-parser');
const sendgrid = require('@sendgrid/mail');
// var inputTokenizer = require("input-tokenizer");

//middleware
const app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

sendgrid.setApiKey(process.env.KEY)


app.get('/', (req, res, next) => {
    res.send('index', { pageTitle: 'Exolve Emailer' });
});

app.post('/send', (req, res, next) => {

    const sender = req.body.fromsender; 
    const receiver = req.body.toemail;
    const subject = req.body.subject;
    const message = req.body.message;


    //this for sending html documents
    const output = `
        // insert html code here
    `;


    const emailString = req.body.to; //the data is stored in the const

    const emailArray = emailString.split(","); //the data is split here

    if (emailArray.length > 1) {

        //use loop
        emailArray.forEach(function (item, index) {

            sendgrid.send({
                to: item.trim(),
                from: sender,
                subject: subject,
                message: message,
                html: output
            })
        });

    } else {
        // send
        sendgrid.send({
            to: receiver,
            from: sender,
            subject: subject,
            message: message,
            html: output

        },
            function (err, json) {
                if (err) {
                    return res.send('bs');
                }
                res.send('<h1>Email sent</h1>');
                res.redirect('/');
            }
        )
    }
    // sendgrid.send({
    //     personalizations: [{
    //         to: [{
    //             email: req.body.to
    //         },        ]  
    //     }],
    //     from: 'exolveTech@gmail.com',
    //     subject: 'mail from sendgrid',
    //     html: output

    // }, 
    // function(err, json) {
    //     if(err) {
    //         return res.send('bs');
    //     }
    //     res.send('<h1>Email sent</h1>');
    // }
    // )
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server is running on ${PORT}`));
