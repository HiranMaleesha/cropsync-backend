const User = require('../Model/UserModel');

//display
const getAllUsers = async (req, res, next) => {
  let Users;

  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res.status(404).json({ message: 'No users found' });
  }

  return res.status(200).json(users);
};

//data insert
const addUser = async (req, res, next) => {
  const { name, email, age, address } = req.body;

  let users;

  try {
    users = new User({ name, email, age, address });
    await users.save();
  } catch (err) {
    console.log(err);
  }

  //if not inserted
  if (!users) {
    return res.status(404).json({ message: 'User could not be created' });
  }
  return res
    .status(200)
    .json({ message: 'User created successfully', user: users });
};


//Get By ID
const getById = async(req, res, next) => {
    const id = req.params.id;

    let user;

    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }

    //user not available
    if (!user){
        return res.status(404).json({message: "User not available"});
    }
    return res.status(200).json({user});
}

//update user
const updateUser = async(req, res, next ) => {
    const id = req.params.id;
    const { name, email, age, address } = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id,{ name: name, email:email, age: age, address: address});
        users = await users.save();
    }catch(err){
        console.log(err);
    }

    //user not available
    if (!users){
        return res.status(404).json({message: "User not available"});
    }
    return res.status(200).json({users});
}

//delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;

  try{
    user = await User.findByIdAndDelete(id)
  }catch (err) {
    console.log(err)
  }

  if (!user){
    return res.status(404).json({message: "unable to delete user"});
}
return res.status(200).json({user});
}


exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;