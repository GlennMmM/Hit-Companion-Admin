var express = require('express');
var router = express.Router();


const Parse = require('parse/node');

/* GET home page. */
router.get('/', (req, res, next) => {

  var a = async () => {

	  let users = []
	  const Users = Parse.Object.extend("User");
	  const query = new Parse.Query(Users);
	  query.include('objectId');
	  query.include('username');
	  query.include('department');
	  query.include('FullName');
	  query.include('createdAt');
	  const results = await query.find({useMasterKey: true});
	  for (let i = 0; i < results.length; i++) {
		  var object = {
	      id: results[i].id,
	      username: results[i].get('username'),
	      department: results[i].get('department'),
	      fullName: results[i].get('FullName'),
	      createdAt: results[i].get('createdAt'),
		  }
		  users.push(object)
	  }
	  res.render('users', { title: 'Users', users: users });
	}
	a()
});

router.get("/delete/:id", (req, res) => {
  res.render('confirmDelete', { title: 'Users' });  
})
router.post("/delete/:id", (req, res) => {
	
	const deleteUser = () => {
  	var User = Parse.Object.extend("User");
  	var query = new Parse.Query(User);
  	query.get(req.params.id, { useMasterKey: true })
    .then((user) => {
      user.destroy({ useMasterKey: true })      

        var a = async () => {
          let users = []
          const Users = Parse.Object.extend("User");
          const query = new Parse.Query(Users);
          query.include('objectId');
          query.include('username');
          query.include('department');
          query.include('FullName');
          query.include('createdAt');
          const results = await query.find({useMasterKey: true});
          for (let i = 0; i < results.length; i++) {
            var object = {
              id: results[i].id,
              username: results[i].get('username'),
              department: results[i].get('department'),
              fullName: results[i].get('FullName'),
              createdAt: results[i].get('createdAt'),
            }
            users.push(object)
          }
          res.render('users', { title: 'Users', users: users, success: "successfully deleted user" });
        }
        a()


      }, (error) => {
          var a = async () => {
            let users = []
            const Users = Parse.Object.extend("User");
            const query = new Parse.Query(Users);
            query.include('objectId');
            query.include('username');
            query.include('department');
            query.include('FullName');
            query.include('createdAt');
            query.include('isAdmin');
            const results = await query.find({useMasterKey: true});
            for (let i = 0; i < results.length; i++) {
              var object = {
                id: results[i].id,
                username: results[i].get('username'),
                department: results[i].get('department'),
                fullName: results[i].get('FullName'),
                createdAt: results[i].get('createdAt'),
                isAdmin: results[i].get('isAdmin')
              }
              users.push(object)
            }
            res.render('users', { title: 'Users', users: users, failed: "failed to delete user" });
          }
          a()
  	  });
	}

	const confirm_delete = () => {
		if(req.body.yes === "Yes, Delete"){
  			return true
  		}else{
  			return false
  		}
  	}


    if (confirm_delete() == true) {
        deleteUser()
    } else {
    	  res.redirect('users')
    }
  })

router.get('/add', (req, res, next) => {

     var a = async () => {
        let depts = []
        const Department = Parse.Object.extend("Department");
        const query = new Parse.Query(Department);
        query.include('name');
        const results = await query.find({useMasterKey: true});
        for (let i = 0; i < results.length; i++) {
          var object = {
            id: results.id,
            name: results[i].get('name')
          }
          depts.push(object)
        }
        res.render('adduser', { title: 'Users', depts: depts });
      }
      a()

});

router.post('/add', (req, res, next) => {

  let admin = ()=>{
    if( req.body.isAdmin == "Admin User" ){
      return "Admin User"
    }else{
      return null
    }
  }

  if (req.body.password1 === req.body.password2) {
    const User = Parse.Object.extend("User");
    const newUser = new User();
    newUser.set("username", req.body.regnum);
    newUser.set("password", req.body.password1);
    newUser.set("department", req.body.department);
    newUser.set("FullName", req.body.fullname);
    newUser.set("isAdmin", req.body.isAdmin )
    newUser.save(null, { useMasterKey: true })
    .then((newUser) => {
      var a = async () => {
        let users = []
        const Users = Parse.Object.extend("User");
        const query = new Parse.Query(Users);
        query.include('objectId');
        query.include('username');
        query.include('department');
        query.include('FullName');
        query.include('createdAt');
        query.include('isAdmin');
        const results = await query.find({ useMasterKey: true });
        for (let i = 0; i < results.length; i++) {
          var object = {
            id: results[i].id,
            username: results[i].get('username'),
            department: results[i].get('department'),
            fullName: results[i].get('FullName'),
            createdAt: results[i].get('createdAt'),
            isAdmin: results[i].get('isAdmin')
          }
          users.push(object)
        }
        res.render('users', { title: 'Users', users: users, success: "New user has been added" });
      }
      a()
    }, (error) => {
      console.log('Failed to create new object, with error code: ' + error.message);
    });
  } else {
    res.render('adduser', { title: 'Users', failed: "Paasword did not match" });
  }
});

router.get('/edit/:id', (req, res, next) => {	

  var a = async () => {
        let depts = []
        const Department = Parse.Object.extend("Department");
        const query = new Parse.Query(Department);
        query.include('name');
        const results = await query.find({useMasterKey: true});
        for (let i = 0; i < results.length; i++) {
          var object = {
            id: results.id,
            name: results[i].get('name')
          }
          depts.push(object)
        }
        res.render('adduser', { title: 'Users', depts: depts });
      }
      a()

})

router.post('/edit/:id', (req, res, next) =>{
		const q = async ()=>{
      const User = Parse.Object.extend("User");
      const query = new Parse.Query(User);
        query.get(req.params.id,{useMasterKey:true})
        .then((user) => {
            user.set("username", req.body.regnum);
            user.set("password", req.body.password1);
            user.set("department", req.body.department);
            user.set("FullName", req.body.fullname);
            user.save(null,{useMasterKey:true});
            res.redirect(301,'/users');
        }, 
        (error) => {
          console.log(error)
          res.render('adduser' , { title: "Users" , failed:"Could not update user" })
        });
    }
    q()

	
})


module.exports = router;