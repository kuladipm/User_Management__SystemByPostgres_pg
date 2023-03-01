const express = require("express");
const bcrypt = require("bcrypt");
const validator=require("validator")
const {
  createUserServices,
   getAllUserServices,
   updateUserServices,
   getPaginationDataServices,
   deleteUserServices,
   checkPasswordServices,
   getSearchedUserServices,
   
} = require("../services/userManagementServices");
const saltRounds = 10;
//validation
let validatePostBody=(body)=>{
  if (body.first_name.trim()===""||!validator.isAlpha(body.first_name)||!validator.isAlpha(body.last_name)||body.last_name.trim()===""||!validator.isEmail(body.email)||body.password.trim()===""||body.apartment.trim()===""||body.date_of_birth.trim()===""||body.gender.trim()===""||body.street.trim()===""||body.landmark.trim()===""||body.city.trim()===""||body.pin_code==="") {
   return true;
  } else {
    return false;
  }
}
let validateUpdateBody=(body)=>{
  if (body.oldPassword!==""&&body.newPassword!=="") {
    if (body.first_name.trim()===""||!validator.isAlpha(body.first_name)||!validator.isAlpha(body.last_name)||body.last_name.trim()===""||!validator.isEmail(body.email)||body.oldPassword.trim()===""||body.newPassword.trim()===""||body.apartment.trim()===""||body.date_of_birth.trim()===""||body.gender.trim()===""||body.street.trim()===""||body.landmark.trim()===""||body.city.trim()===""||body.pin_code==="") {
      return true;
     } else {
       return false;
     }
  } else {
    if (body.first_name.trim()===""||!validator.isAlpha(body.first_name)||!validator.isAlpha(body.last_name)||body.last_name.trim()===""||!validator.isEmail(body.email)||body.apartment.trim()===""||body.date_of_birth.trim()===""||body.gender.trim()===""||body.street.trim()===""||body.landmark.trim()===""||body.city.trim()===""||body.pin_code==="") {
      return true;
     } else {
       return false;
     }
  }
  
}
let checkEmail=async(email)=>{
  let emailResp= await getSearchedUserServices(email)
  if (emailResp.rowCount===0) {
    return false;
  }
  else{
    return true;
  }
}
let checkPassword=async(id,oldPass)=>{
  console.log(oldPass)
  let oldPasswordResp= await checkPasswordServices(id)
   console.log(oldPasswordResp)
  const match = await bcrypt.compareSync(oldPass, oldPasswordResp);
   console.log(await match)
  if (match) {
    return false;
  }
  else{
    return true;
  }
}
//post method for sending data to json file
const createUser = async (req, res) => {
  const body = req.body;
  if (validatePostBody(body)) {
    res.status(400).send("please enter valid user details")
  } else if(await checkEmail(body.email)) {
    res.status(400).send("email are already exist please enter new email")
  }else{
  let bcryptPassword= bcrypt.hashSync(body.password, saltRounds)
  const createResponse = await createUserServices(body,bcryptPassword);
    res.status(200).send("user created successfully")
    // console.log(createResponse)
}
 
};
//GET method for getting all data from json file
const getAllUser =async (req, res) => {
const selectResponse=await getAllUserServices();
if(selectResponse.length>0){
  res.status(200).send(selectResponse)
  console.log(selectResponse)
}
else{
  res.status(400).send("Something is wrong")
}

};


//patch method
const updateUser = async (req, res) => {
  const body =await req.body;
  const id =await req.params.id
  let oldPassword= await req.body.oldPassword
  let newPassword= bcrypt.hashSync(body.newPassword, saltRounds)
  if( validateUpdateBody(body)) {
    res.status(400).send("please enter valid user details")
  } else if(await body.oldPassword!==""&& body.newPassword!=="" && await checkPassword(id,oldPassword)) {
    res.status(400).send("old password are not matching")
  }else{
  const updateResponse =await updateUserServices(body,id,newPassword);
    res.status(200).send("data updated successfully")
}
};

// GET method for pagination data
const getPaginationData =async (req, res) => {
  const servicesResponse= await getPaginationDataServices(req.query.page,req.query.limit);
  
  if(servicesResponse.paginationData.length>0){
    res.status(200).send(servicesResponse)
    // console.log(servicesResponse)
  }
  else{
    res.status(400).send("Something is wrong")
  }
};

const getSearchedUser=async (req,res)=>{
  let email=req.params.email;
  const searchResponse=await getSearchedUserServices(email);
  if(searchResponse.rowCount>0){
    res.status(200).send(searchResponse.rows)
  }
  else{
    res.status(400).send("Something is wrong")
  }
}

//delete  one record form json file
const deleteUser= async (req, res) => {
  const deleteServiceResponse = await deleteUserServices(req.params.id);
 
  if(!deleteServiceResponse){
    res.status(400).send("Something is wrong")
   
  }
  else{
    res.status(200).send("data deleted successfully")
    
  }
  
};
//delete  all record form json file
const deleteAllRecords = (req, res) => {
  const deleteAllRecordsResponse = deleteAllRecordsService(req.params.id);
  if (deleteAllRecordsResponse.success === true) {
    res.status(200).send(deleteAllRecordsResponse.msg);
  } else {
    res.status(400).send(deleteAllRecordsResponse.error);
  }
};
module.exports = {
  createUser,
  getAllUser,
  updateUser,
  getPaginationData,
  deleteUser,
  getSearchedUser
  // updateUserData,
  // deleteSingleRecord,
  // deleteAllRecords,
};
