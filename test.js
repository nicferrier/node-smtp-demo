const smtp = require("./smtp.js");
const nodeMail = require("mail");

const testWithMailer = async function() {
    // Start the server
    const server = smtp(1465);

    await new Promise((resolve, reject) => {
        const mail = nodeMail.Mail({
            host: 'localhost',
            port: 1465,
            // username: 'nic@example.com',
            // password: '**password**',
            secure: false
        });
        
        const mailTx = mail.message({
            from: "sender@example.net",
            to: ["recipient@somewhere.org"],
            subject: "Hello from Node.JS"
        });
        mailTx.body("Node speaks SMTP!");
        mailTx.send(err => {if (err) reject(err); resolve(true);});
    });
    server.close();
}

testWithMailer().then();

// End
