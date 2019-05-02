var express = require('express');
var router = express.Router();
const Parse = require('parse/node');

/* GET home page. */
router.get('/', function(req, res, next) {

    var a = async () => {
        let depts = []
        const Department = Parse.Object.extend("Department");
        const query = new Parse.Query(Department);
        query.include('name');
        query.include('chairman');
        query.include('description');
        const results = await query.find({ useMasterKey: true });
        for (let i = 0; i < results.length; i++) {
            var object = {
                id: results[i].id,
                name: results[i].get('name'),
                chairman: results[i].get('chairman'),
                description: results[i].get('description'),
            }
            depts.push(object)
        }
        res.render('depts', { title: 'Department', depts: depts });
    }
    a()
});

router.get('/add', (req, res) => {
    res.render('addDept', { title: "Departments" })
})

router.post('/add', (req, res) => {

    const Department = Parse.Object.extend("Department");
    const newDept = new Department();
    newDept.set("name", req.body.deptname);
    newDept.set("chairman", req.body.chairman);
    newDept.set("description", req.body.description);
    newDept.save(null, { useMasterKey: true })
        .then((newDept) => {
            res.redirect('/depts')
        }, (error) => {
            console.log('Failed to create new object, with error code: ' + error.message);
        });

})

router.get('/delete/:id', (req, res, next) => {
    res.render('confirmDelete', { title: 'Department' });
});

router.post('/delete/:id', (req, res) => {

    // CONFIRM DELETE FUNCTION DECLARATION
    const confirm_delete = () => {
        if (req.body.yes === "Yes, Delete") {
            return true
        } else {
            return false
        }
    }
    // DELETE FUNCTION DECLARATION
    const deleteUser = () => {

        var Department = Parse.Object.extend("Department");
        var query = new Parse.Query(Department);
        query.get(req.params.id, { useMasterKey: true })
            .then((user) => {
                    user.destroy({ useMasterKey: true })
                    res.redirect('/depts')
                },
                (error) => {
                    console.log(error)
                });
    }
    // DELETING
    if (confirm_delete()) {
        deleteUser()
    } else {
        res.redirect('/depts')
    }
})

router.get('/edit/:id', (req, res) => {
    res.render('addDept', { title: "Departments" })
})

router.post('/edit/:id', (req, res, next) => {
    const q = async () => {
        const Department = Parse.Object.extend("Department");
        const query = new Parse.Query(Department);
        query.get(req.params.id, { useMasterKey: true })
            .then((dept) => {
                    dept.set("name", req.body.deptname);
                    dept.set("chairman", req.body.chairman);
                    dept.set("description", req.body.description);
                    dept.save(null, { useMasterKey: true });
                    res.redirect(301, '/depts');
                },
                (error) => {
                    console.log(error)
                    res.render('addDept', { title: 'Deaprment', failed: "Could not update user" })
                });
    }
    q()

})

router.get('/notification/:dept', (req, res) => {

    var a = async () => {
        let deptsNotis = []
        const DeptNotifications = Parse.Object.extend("DeptNotifications");
        const query = new Parse.Query(DeptNotifications);
        query.include('department');
        query.include('notification');
        query.include('expireDate');
        const results = await query.find({ useMasterKey: true });
        for (let i = 0; i < results.length; i++) {
            if (new Date() < results[i].get('expireDate') && req.params.dept == results[i].get('department')) {
                var object = {
                    id: results[i].id,
                    dept: results[i].get('department'),
                    notis: results[i].get('notification'),
                    expire: results[i].get('expireDate'),
                }
                deptsNotis.push(object)
            } else {}
        }
        res.render('notification', { title: 'Department', depts: deptsNotis, dept: req.params.dept });
    }
    a()

})
router.get('/notification/:id/add', (req, res) => {
    res.render('addNotifs', { title: 'Department' });
})
router.post('/notification/:dept/add', (req, res) => {

    const DeptNotifications = Parse.Object.extend("DeptNotifications");
    const newDeptNotif = new DeptNotifications();
    newDeptNotif.set("department", req.params.dept);
    newDeptNotif.set("notification", req.body.notification);
    newDeptNotif.set("expireDate", new Date(req.body.expireDate));
    newDeptNotif.save(null, { useMasterKey: true })
    .then((newDept) => {
        var a = async () => {
            let deptsNotis = []
            const DeptNotifications = Parse.Object.extend("DeptNotifications");
            const query = new Parse.Query(DeptNotifications);
            query.include('department');
            query.include('notification');
            query.include('expireDate');
            const results = await query.find({ useMasterKey: true });
            for (let i = 0; i < results.length; i++) {
                if (new Date() < results[i].get('expireDate') && req.params.dept == results[i].get('department')) {
                    var object = {
                        id: results[i].id,
                        dept: results[i].get('department'),
                        notis: results[i].get('notification'),
                        expire: results[i].get('expireDate'),
                    }
                    deptsNotis.push(object)
                } else {}
            }
            res.render('notification', { title: 'Department', depts: deptsNotis, dept: req.params.dept });
        }
        a()
    }, (error) => {
        res.end('Failed to create new object, with error code: ' + error.message);
    });
})

router.get('/notification/:dept/delete/:id', (req, res) => {
    res.render('confirmDelete', { title: 'Department' });
})
router.post('/notification/:dept/delete/:id', (req, res) => {
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
        var DeptNotifications = Parse.Object.extend("DeptNotifications");
        var query = new Parse.Query(DeptNotifications);
        query.get(req.params.id, { useMasterKey: true })
        .then((user) => {
            user.destroy({ useMasterKey: true })

            var a = async () => {
                let deptsNotis = []
                const DeptNotifications = Parse.Object.extend("DeptNotifications");
                const query = new Parse.Query(DeptNotifications);
                query.include('department');
                query.include('notification');
                query.include('expireDate');
                const results = await query.find({ useMasterKey: true });
                for (let i = 0; i < results.length; i++) {
                    if (new Date() < results[i].get('expireDate') && req.params.dept == results[i].get('department')) {
                        var object = {
                            id: results[i].id,
                            dept: results[i].get('department'),
                            notis: results[i].get('notification'),
                            expire: results[i].get('expireDate'),
                        }
                        deptsNotis.push(object)
                    } else {}
                }
                console.log(req.params)
                console.log(req.body)
                res.render('notification', { title: 'Department', depts: deptsNotis, dept: req.params.dept });
            }
            a()
        },
        (error) => {
            console.log(error)
        });
    }
    // DELETING
    if (confirm_delete() == true) {
        deleteUser()
    } else {
        res.redirect('/depts')
    }

})

router.get('/notification/:dept/edit/:id', (req, res) => {
    res.render('addNotifs', { title: 'Department' });
})

router.post('/notification/:dept/edit/:id', (req, res) => {
    const q = async () => {
        const DeptNotifications = Parse.Object.extend("DeptNotifications");
        const query = new Parse.Query(DeptNotifications);
        query.get(req.params.id, { useMasterKey: true })
        .then((dNotif) => {
            dNotif.set("department", req.params.dept);
            dNotif.set("notification", req.body.notification);
            dNotif.set("expireDate", new Date(req.body.expireDate));
            dNotif.save(null, { useMasterKey: true });
            var a = async () => {
                let deptsNotis = []
                const DeptNotifications = Parse.Object.extend("DeptNotifications");
                const query = new Parse.Query(DeptNotifications);
                query.include('department');
                query.include('notification');
                query.include('expireDate');
                const results = await query.find({ useMasterKey: true });
                for (let i = 0; i < results.length; i++) {
                    if (new Date() < results[i].get('expireDate') && req.params.dept == results[i].get('department')) {
                        var object = {
                            id: results[i].id,
                            dept: results[i].get('department'),
                            notis: results[i].get('notification'),
                            expire: results[i].get('expireDate'),
                        }
                        deptsNotis.push(object)
                    }else{

                    }
                }
                res.render('notification', { title: 'Department', depts: deptsNotis, dept: req.params.dept });
            }
            a()                 
        },
        (error) => {
            console.log(error)
            res.render('addDept', { title: 'Department', failed: "Could not update notification" })
        });
    }
    q()
})

module.exports = router;