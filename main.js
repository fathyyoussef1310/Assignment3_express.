
const fsPromises = require("node:fs/promises");
const express = require("express");
const path = require('node:path');
const app = express();
const PORT  = 3000;
app.use(express.json());
async function getUsers() {
    let body = await fsPromises.readFile(path.join(__dirname ,"users.json"), "utf8");
    return JSON.parse(body);
}
async function saveUsers(users){
     await fsPromises.writeFile(
         path.join(__dirname, "users.json"),
         JSON.stringify(users, null, 2),
         "utf8"
   );
}
async function authMiddleWare(req, res, next) {
    const authenticated = req.headers.authorization;
    if (!authenticated) {
        return res.status(401).json("Please Register First");
    }
    next();
}
app.post("/auth/register", async (req, res) => {
    try {
        let users = await getUsers();
        let userIndex = users.findIndex(user => user.email
            == req.body.email);
        if (userIndex === -1) {
            let newUser = {
                id: users.length + 1,
                email: req.body.email,
                age: req.body.age,
                name: req.body.name,
                password: req.body.password,
                phone: req.body.phone,
            }
            users.push(newUser);
            await saveUsers(users);
            res.status(200).json({
                success: true,
                message: "Successfully registered",
                data: newUser,
            });
        }else{
            res.status(400).json({message:"This User already Exists"})
        }
    } catch (err) {
        res.status(400).json({
            message: "This User already exists!",
            success: false,
        })
    }
});

app.patch("/user/:id",authMiddleWare, async (req, res) => {
    try {
        let users = await getUsers();
        let userIndex = users.findIndex(user => user.id === Number(req.params.id));
        if (userIndex > -1) {
            users[userIndex]={
                ...users[userIndex],
                ...req.body
            };
            await saveUsers(users);
            res.status(200).json({success: true, message: "Successfully updated" , data: users[userIndex]});
        } else {
            return  res.status(400).json({message:"This User does not exist"})
        }
    }catch(err){
        console.log(err);
        return res.status(400).
        json({message:"Something went wrong"})
    }
})

app.post('/auth/login',authMiddleWare ,async (req, res) => {
    try {
        let users = await getUsers();
        let userIndex = users.find(user => user.email === req.body.email &&
            user.password === req.body.password);
        if (!userIndex) {
            return res.status(401).json("Please register  First ");
        } else {
            return res.status(200).json({success: true, message: "Login Successful", data: userIndex,});
        }
    }catch(err){
        return  res.status(400).json({message:"Login Failed"})
    }
});

app.delete('/auth/delete/:id',authMiddleWare ,async (req, res) => {
    try {
        let users = await getUsers();
        let userIndex = users.findIndex(user => user.id === Number(req.params.id));
        if (userIndex === -1)
        {
            return res.status(401).json("Please register  First ");
        }
            users.splice(userIndex, 1);
            await saveUsers(users);
            return res.status(200).json({success: true, message: "User Deleted Successful",});
    }catch(err){
        console.log("DELETE ERROR:", err);

        return  res.status(400).json({message:"Deleted Failed"})
    }
});

app.get('/auth/get',authMiddleWare ,async (req, res) => {
try {
    let users = await getUsers();
    return  res.status(200).json({data:users , status:"success" , message: "Successfully getting users"});
}catch(err){
    return res.status(404).json({message:"Not Found"})
}
})

app.get('/auth/get/:id',authMiddleWare ,async (req, res) => {
try {
    let users = await getUsers();
    let userIndex = users.find(user => user.id === Number(req.params.id));
    if (userIndex) return  res.status(200).
    json({data:userIndex , status:"success" , message: "Successfully getting users"});
    else return  res.status(400).json({message:"User not found"})
}catch(err){
    return res.status(404).json({message:"Not Found"})
}
});

app.get('/get/user/:name',authMiddleWare ,async (req, res) => {
    try {
        let users = await getUsers();
        let userIndex = users.find(user => user.name === req.params.name);
        if (userIndex) return  res.status(200).json({success:true,
            data:userIndex,
        });
        else return  res.status(400).json({message:"User not found"})
    }catch(err){
        return res.status(404).json({message:"Not Found"})
    }
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})


/*
Question 1 Essay Questions

1. What is the Node.js Event Loop?
It continuously checks whether there are tasks waiting to be executed. When an asynchronous operation is completed,

2. Libuv and What Role Does It Play in Node.js?
Helps In many Operations Like Compressions Files(FileSystem) , DNS Operations , Async Operations and CryptoGraphy

3. How Does Node.js Handle Asynchronous Operations Under the Hood?
When Node.js starts an asynchronous operation, it does not wait for the operation to finish.
The operation can be handled by the operating system or by Libuv's thread pool, depending on the type of operation.

5- What is the Node.js Thread Pool and How to Set the Thread Pool Size?
 The Node.js Thread Pool is a group of worker threads provided by Libuv. It is used for certain operations that could otherwise block the main thread.
 set UV_THREADPOOL_SIZE=8
 node app.js
 */