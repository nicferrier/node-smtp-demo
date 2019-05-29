// Arsing around with an SMTP Server that could do things

const stream = require("stream");
const SMTPServer = require("smtp-server").SMTPServer;

const start = function (port) {
    const server = new SMTPServer({
        secure: false,
        name: "localhost.example.com",
        disabledCommands: ["STARTTLS"],
        authOptional: true,
        disableReverseLookup: true,

        // If we turn off auth we don't need this
        onAuth(auth, session, callback) {
            if (auth.username !== "abc" || auth.password !== "def") {
                return callback(new Error("Invalid username or password"));
            }
            callback(null, { user: "abc" });
        },

        /*
        onMailFrom(address, session, callback) {
            // Validate addresses here...
            return callback();
        },

        onRcptTo(address, session, callback) {
            return callback();
        },
        */
        
        async onData(data, session, callback) {
            const dataData = await new Promise((resolve, reject) => {
                let buffer = Buffer.alloc(0);
                const sink = new stream.Writable({
                    write(chunk, encoding, callback) {
                        buffer = Buffer.concat([buffer, chunk]);
                        callback();
                    },
                    final(callback) {
                        callback();
                        resolve(buffer);
                    }
                });
                data.pipe(sink);
            });
            console.log(
                "server has data",
                dataData.toString("utf8"),
                session.envelope
            );
            return callback();
        }
    });
    server.listen(port);
    console.log("listening", port);
    return server;
};

module.exports = start;

// End
