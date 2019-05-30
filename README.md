# Demo of how to use Node SMTP server

I've a mind to develop mail interfaces to certain services. For
example, problem ticket systems have a natural email interface.

Getting started with things is often tricky. So here's an example of
how to do it in Node.

The SMTP server framework I'm using is [this](https://nodemailer.com/extras/smtp-server/).


## Email is the missing link in automation?

As big email services dominate in both enterprises and small companies
people forget how to do automation via email.

Luckily, it's even easier these days than it was in the past because
it's so easy to make a custom SMTP server that will do exactly what
you want.

Many people don't know how email works... so here's a quick overview:


## How sending email works

Email uses a protocol called SMTP which was one of the first
application protocols on the Internet.

If the sender is bob@demo.com, it works like this:

```
bob@demo.com: types an email to nic@example.com - sends to MTA (Mail Transport Agent)

Sender MTA: DNS lookup MX (Mail eXchange) record for example.com

example.com DNS: the MX record is mail.example.com

Sender MTA: make a tcp connection to host: mail.example.com, port 25

mail.example.com MTA: send 250 Ok!

Sender MTA: got a response, so send MAIL FROM: bob@demo.com

mail.example.com MTA: got mail from, so send 250 Ok!

Sender MTA: got Ok, so send RCPT TO: nic@example.com

mail.example.com MTA: got rcpt to, so send 250 Ok!

Sender MTA: got Ok, so send DATA [CR LF] message .... [CR LF] . [CR LF]

mail.example.com MTA: got data correctly terminate, so send 250 Ok! and now deliver the email to nic
```

So once you are connected to the receivers SMTP server there are
basically 3 steps:

* tell the server who the email is from
* tell the server who the email is too
* transfer the data part of the mail

There can be many more steps to do with security and spam
protection... but this is basically it.


## What does delivery look like?

When the data of an email is accepted the receiver's MTA usually has
to deliver the mail it has been sent to the receipient in question.

In the olds days, that meant delivering it to a special mailbox file
owned by the user on the server in question.

These days it mostly means inserting the mail in some data structure
in a database server. That's basically what Microsoft Exchange is.


### Modern automation through delivery

But delivery could be anything. Imagine, that we can raise support
problems via email. This could be automated. Perhaps we can send an
email like this:

```
From: nic@ferrier
To: new@support-ticket.com
Subject: I can't login!

Hi... errr... I think I've forgotten my password. Can you help?
```

We can construct an SMTP server such that when it receives this email
it looks at the `To` and sees `new@` and uses the rest of the email to
create a service ticket in our ticketing system.

Imagine that the service tickteing system could be subscribed to
through an event feed and a support person updates the ticket with a
fix, we could cosume that event and tie it back to the origin email
and send a response like:

```
To: nic@ferrier
From: SUPPORT-7102@support-ticket.com
Subject: RE: I can't login!

I have reset your password to your date of 
birth + home town in all caps, like:

20190712LONDON

You'll be required to reset your password on login.

Let us know of any further problems!

Thanks!
```

