var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

/* GET home page. */
router.get('/', (req, res, next) => {
    var a = async () => {
        let clubs = []
        const Clubs = Parse.Object.extend("Clubs");
        const query = new Parse.Query(Clubs);
        query.include('name');
        query.include('advisors');
        query.include('description');
        const results = await query.find({ useMasterKey: true });
        for (let i = 0; i < results.length; i++) {
            var object = {
                id: results[i].id,
                name: results[i].get('name'),
                advisors: results[i].get('advisors'),
                description: results[i].get('description'),
            }
            clubs.push(object)
        }
        res.render('clubs', { title: 'Clubs', clubs: clubs });
    }
    a()
});

router.get('/delete/:id', (req, res, next) => {
    res.render('confirmDelete', { title: 'Clubs' });
});

router.post('/delete/:id', (req, res) => {
    // CONFIRM DELETE
    const confirm_delete = () => {
        if (req.body.yes === "Yes, Delete") {
            return true
        } else {
            return false
        }
    }
    // DELETE FUNCTION
    const deleteUser = () => {
        var Clubs = Parse.Object.extend("Clubs");
        var query = new Parse.Query(Clubs);
        query.get(req.params.id, { useMasterKey: true })
            .then((user) => {
                console.log(user)
                    user.destroy({ useMasterKey: true })
                    // res.redirect('clubs')
                    var a = async () => {
                        let clubs = []
                        const Clubs = Parse.Object.extend("Clubs");
                        const query = new Parse.Query(Clubs);
                        query.include('name');
                        query.include('advisors');
                        query.include('description');
                        const results = await query.find({ useMasterKey: true });
                        for (let i = 0; i < results.length; i++) {
                            var object = {
                                id: results[i].id,
                                name: results[i].get('name'),
                                advisors: results[i].get('advisors'),
                                description: results[i].get('description'),
                            }
                            clubs.push(object)
                        }
                        res.render('clubs', { title: 'Clubs', clubs: clubs });
                    }
                    a()
                },
                (error) => {
                    var a = async () => {
                        let clubs = []
                        const Clubs = Parse.Object.extend("Clubs");
                        const query = new Parse.Query(Clubs);
                        query.include('name');
                        query.include('advisors');
                        query.include('description');
                        const results = await query.find({ useMasterKey: true });
                        for (let i = 0; i < results.length; i++) {
                            var object = {
                                id: results[i].id,
                                name: results[i].get('name'),
                                advisors: results[i].get('advisors'),
                                description: results[i].get('description'),
                            }
                            clubs.push(object)
                        }
                        res.render('clubs', { title: 'Clubs', clubs: clubs, failed: "failed to delete the club" });
                    }
                    a()
                });
    }
    // DELETING LOGIC
        if (confirm_delete() == true) {

            deleteUser()
        } else {
            var a = async () => {
                let clubs = []
                const Clubs = Parse.Object.extend("Clubs");
                const query = new Parse.Query(Clubs);
                query.include('name');
                query.include('advisors');
                query.include('description');
                const results = await query.find({ useMasterKey: true });
                for (let i = 0; i < results.length; i++) {
                    var object = {
                        id: results[i].id,
                        name: results[i].get('name'),
                        advisors: results[i].get('advisors'),
                        description: results[i].get('description'),
                    }
                    clubs.push(object)
                }
                res.render('clubs', { title: 'Clubs', clubs: clubs });
            }
            a()
        }
})

router.get('/add', (req, res) => {
    res.render('addClub', { title: 'Clubs' });
})

router.post('/add', (req, res, next) => {
    const Clubs = Parse.Object.extend("Clubs");
    const newClub = new Clubs();
    newClub.set("name", req.body.clubname);
    newClub.set("advisors", req.body.advisor);
    newClub.set("description", req.body.description);
    newClub.save(null, { useMasterKey: true })
        .then((newUser) => {
            var a = async () => {
                let clubs = []
                const Clubs = Parse.Object.extend("Clubs");
                const query = new Parse.Query(Clubs);
                query.include('name');
                query.include('advisors');
                query.include('description');
                const results = await query.find({ useMasterKey: true });
                for (let i = 0; i < results.length; i++) {
                    var object = {
                        id: results[i].id,
                        name: results[i].get('name'),
                        advisors: results[i].get('advisors'),
                        description: results[i].get('description'),
                    }
                    clubs.push(object)
                }
                res.render('clubs', { title: 'Clubs', clubs: clubs });
            }
            a()
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });
});

router.get('/edit/:id', (req, res, next) => {
    res.render('addClub', { title: 'Clubs' });
})

router.post('/edit/:id', (req, res, next) => {
    const q = async () => {
        const Clubs = Parse.Object.extend("Clubs");
        const query = new Parse.Query(Clubs);
        query.get(req.params.id, { useMasterKey: true })
            .then((club) => {
                    club.set("name", req.body.clubname);
                    club.set("advisors", req.body.advisor);
                    club.set("description", req.body.description);
                    club.save(null, { useMasterKey: true });
                    res.redirect(301, '/clubs');
                },
                (error) => {
                    console.log(error)
                    res.render('addClub', { title: 'Clubs', failed: "Could not update user" })
                });
    }
    q()
})

router.get('/notification/:id', (req, res) => {

    var a = async () => {
        let clubNotis = []
        const Club_Notification = Parse.Object.extend("Club_Notification");
        const query = new Parse.Query(Club_Notification);
        query.include('club');
        query.include('notification');
        query.include('expireDate');
        const results = await query.find({ useMasterKey: true });
        for (let i = 0; i < results.length; i++) {
            if (new Date() < results[i].get('expireDate') && req.params.id == results[i].get('club')) {
                var object = {
                    id: results[i].id,
                    club: results[i].get('club'),
                    notis: results[i].get('notification'),
                    expire: results[i].get('expireDate'),
                }
                clubNotis.push(object)
            } else {}
        }
        res.render('clubNotifications', { title: 'Clubs', clubs: clubNotis, club: req.params.id });
    }
    a()
})

router.get('/notification/:id/add', (req, res) => {
    res.render('addNotifs', { title: 'Clubs' , club: req.params.club });
})

router.post('/notification/:id/add', (req, res) => {

    const Club_Notification = Parse.Object.extend("Club_Notification");
    const newClubnotis = new Club_Notification();
    newClubnotis.set("club", req.params.id);
    newClubnotis.set("notification", req.body.notification);
    newClubnotis.set("expireDate", new Date(req.body.expireDate));
    newClubnotis.save(null, { useMasterKey: true })
        .then((newDept) => {
            // res.redirect('clubs')
            var a = async () => {
                let clubNotis = []
                const Club_Notification = Parse.Object.extend("Club_Notification");
                const query = new Parse.Query(Club_Notification);
                query.include('club');
                query.include('notification');
                query.include('expireDate');
                const results = await query.find({ useMasterKey: true });
                for (let i = 0; i < results.length; i++) {
                    if (new Date() < results[i].get('expireDate') && req.params.id == results[i].get('club')) {
                        var object = {
                            id: results[i].id,
                            club: results[i].get('club'),
                            notis: results[i].get('notification'),
                            expire: results[i].get('expireDate'),
                        }
                        clubNotis.push(object)
                    } else {}
                }
                res.render('clubNotifications', { title: 'Clubs', clubs: clubNotis , club: req.params.id });
            }
            a()
        }, (error) => {
            res.end('Failed to create new object, with error code: ' + error.message);
    });
})

router.get('/notification/:club/delete/:id', (req, res) => {
    res.render('confirmDelete', { title: 'Clubs' });
})

router.post('/notification/:club/delete/:id', (req, res) => {
    // CONFIRM DELETE
    const confirm_delete = () => {
        if (req.body.yes === "Yes, Delete") {
            return true
        } else {
            return false
        }
    }
    // DELETE FUNCTION
    const deleteUser = () => {
        var Club_Notification = Parse.Object.extend("Club_Notification");
        var query = new Parse.Query(Club_Notification);
        query.get(req.params.id, { useMasterKey: true })
            .then((user) => {
                    user.destroy({ useMasterKey: true })
                    var a = async () => {
                        let clubNotis = []
                        const Club_Notification = Parse.Object.extend("Club_Notification");
                        const query = new Parse.Query(Club_Notification);
                        query.include('club');
                        query.include('notification');
                        query.include('expireDate');
                        const results = await query.find({ useMasterKey: true });
                        for (let i = 0; i < results.length; i++) {
                            if (new Date() < results[i].get('expireDate') && req.params.club == results[i].get('club')) {
                                var object = {
                                    id: results[i].id,
                                    club: results[i].get('club'),
                                    notis: results[i].get('notification'),
                                    expire: results[i].get('expireDate'),
                                }
                                clubNotis.push(object)
                            } else {}
                        }
                        res.render('clubNotifications', { title: 'Clubs', clubs: clubNotis , club: req.params.club });
                    }
                    a()
                },
                (error) => {
                    var a = async () => {
                        let clubNotis = []
                        const Club_Notification = Parse.Object.extend("Club_Notification");
                        const query = new Parse.Query(Club_Notification);
                        query.include('club');
                        query.include('notification');
                        query.include('expireDate');
                        const results = await query.find({ useMasterKey: true });
                        for (let i = 0; i < results.length; i++) {
                            if (new Date() < results[i].get('expireDate') && req.params.id == results[i].get('club')) {
                                var object = {
                                    id: results[i].id,
                                    club: results[i].get('club'),
                                    notis: results[i].get('notification'),
                                    expire: results[i].get('expireDate'),
                                }
                                clubNotis.push(object)
                            } else {}
                        }
                        res.render('clubNotifications', { title: 'Clubs', depts: clubNotis, id: req.params.id, failed: "failed to delete notification" });
                    }
                    a()
                });
    }
    // DELETING LOGIC
    if (confirm_delete() == true) {        
        deleteUser()
    } else {
        var a = async () => {
            let clubNotis = []
            const Club_Notification = Parse.Object.extend("Club_Notification");
            const query = new Parse.Query(Club_Notification);
            query.include('club');
            query.include('notification');
            query.include('expireDate');
            const results = await query.find({ useMasterKey: true });
            for (let i = 0; i < results.length; i++) {
                if (new Date() < results[i].get('expireDate') && req.params.id == results[i].get('club')) {
                    var object = {
                        id: results[i].id,
                        club: results[i].get('club'),
                        notis: results[i].get('notification'),
                        expire: results[i].get('expireDate'),
                    }
                    clubNotis.push(object)
                } else {}
            }
            res.render('clubNotifications', { title: 'Clubs', depts: clubNotis, id: req.params.id });
        }
        a()
    }
})

router.get('/notification/:club/edit/:id', (req,res)=>{
    res.render('addNotifs', { title: 'Clubs' , club: req.params.club });
})

router.post('/notification/:club/edit/:id', (req,res)=>{

    console.log(req.params)
    console.log(req.body)

    const q = async () => {
        const Club_Notification = Parse.Object.extend("Club_Notification");
        const query = new Parse.Query(Club_Notification);
        query.get(req.params.id, { useMasterKey: true })
            .then((notif) => {
                    notif.set("club", req.params.club);
                    notif.set("notification", req.body.notification);
                    notif.set("expireDate", new Date(req.body.expireDate));
                    notif.save(null, { useMasterKey: true });



                    // res.redirect(301, '/depts');
                    var a = async () => {
                        let clubNotis = []
                        const Club_Notification = Parse.Object.extend("Club_Notification");
                        const query = new Parse.Query(Club_Notification);
                        query.include('club');
                        query.include('notification');
                        query.include('expireDate');
                        const results = await query.find({ useMasterKey: true });
                        for (let i = 0; i < results.length; i++) {
                            if (new Date() < results[i].get('expireDate') && req.params.club == results[i].get('club')) {
                                var object = {
                                    id: results[i].id,
                                    club: results[i].get('club'),
                                    notis: results[i].get('notification'),
                                    expire: results[i].get('expireDate'),
                                }
                                clubNotis.push(object)
                            } else {}
                        }
                        res.render('clubNotifications', { title: 'Clubs', clubs: clubNotis , club: req.params.club });
                    }
                    a()
                    a()



                },
                (error) => {
                    console.log(error)
                    res.render('addDept', { title: 'Deaprment', failed: "Could not update user" })
                });
    }
    q()
})



module.exports = router;