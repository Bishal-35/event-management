const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bishal",
    database: "event_management",
});

//Home Route 
app.get("/", (req, res) => {
    let q = `SELECT * FROM event`;
    try {
        connection.query(q, (err, events) => {
            if (err) {
                console.log(err);
                res.send("Some error in DB");
                return;
            }
            res.render("home.ejs", { events });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});


app.get("/show", (req, res) => {
    let q = `SELECT name, date, time from event_schedule, event where event_schedule.id = event.id`;
    try {
        connection.query(q, (err, results) => {
            if (err) {
                console.log(err);
                res.send("Some error in DB");
                return;
            }

            if (results.length > 0) {
                const event = results[0]; 
                res.render("show.ejs", { event });
            } else {
                res.send("No events found");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

//Show Details by ID
app.get("/show/:id", (req, res) => {
    const eventId = req.params.id;
    let q = `SELECT name, date, time FROM event_schedule, event WHERE event_schedule.id = event.id AND event.id = ?`;
    try {
        connection.query(q, [eventId], (err, result) => {
            if (err) {
                console.log(err);
                res.send("Some error in DB");
                return;
            }
            if (result.length === 0) {
                res.send("Event not found");
                return;
            }
            const event = result[0]; 
            res.render("show.ejs", { event });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

//ADD route
app.get("/add",(req,res)=>{
    res.render("add.ejs");
});

app.post("/add", (req, res) => {
    let {id, name, date, time} = req.body;
    
    let q1 = `INSERT INTO event (id, name) VALUES (?, ?)`;
    try {
        connection.query(q1, [id, name], (err, result) => {
            if (err) {
                console.log(err);
                res.send("Some error in DB: " + err.message);
                return;
            }
            
            let q2 = `INSERT INTO event_schedule (id, date, time) VALUES (?, ?, ?)`;
            connection.query(q2, [id, date, time], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Some error in DB: " + err.message);
                    return;
                }
                res.redirect("/");
            });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred");
    }
});

//Delete route
app.get("/delete/:id", (req,res)=>{
    const { id } = req.params;
    const q = `SELECT * FROM event WHERE id = ?`;

    connection.query(q, [id], (err, result) => {
        if (err) {
          console.log(err);
          return res.send("DB error");
        }
        if (result.length === 0) {
          return res.send("Event not found");
        }
        const event = result[0];
        res.render("delete.ejs", { event });
    });
});

app.post("/delete/:id", (req, res) => {
    const { id } = req.params;
    const deleteScheduleQuery = `DELETE FROM event_schedule WHERE id = ?`;
    connection.query(deleteScheduleQuery, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error deleting event schedule: " + err.message);
        }
        const deleteEventQuery = `DELETE FROM event WHERE id = ?`;
        connection.query(deleteEventQuery, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Error deleting event: " + err.message);
            }
            console.log("Event deleted successfully");
            res.redirect("/");
        });
    });
});

//Edit Route
app.get("/edit/:id", (req, res) => {
    const eventId = req.params.id;
    let q = `SELECT e.id, e.name, es.date, es.time 
             FROM event e 
             JOIN event_schedule es ON e.id = es.id 
             WHERE e.id = ?`;
    
    try {
        connection.query(q, [eventId], (err, result) => {
            if (err) {
                console.log(err);
                res.send("Some error in DB");
                return;
            }
            if (result.length === 0) {
                res.send("Event not found");
                return;
            }
            const event = result[0]; 
            res.render("edit.ejs", { event });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});

app.post("/edit/:id", (req, res) => {
    const eventId = req.params.id;
    let { name, date, time } = req.body;
    let q1 = `UPDATE event SET name = ? WHERE id = ?`;
    try {
        connection.query(q1, [name, eventId], (err, result) => {
            if (err) {
                console.log(err);
                res.send("Error updating event: " + err.message);
                return;
            }
            let q2 = `UPDATE event_schedule SET date = ?, time = ? WHERE id = ?`;
            connection.query(q2, [date, time, eventId], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Error updating schedule: " + err.message);
                    return;
                }
                
                res.redirect("/");
            });
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred");
    }
});

app.listen("8080", () => {
    console.log("Server is listening to port 8080");
});