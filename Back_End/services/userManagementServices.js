const fs = require("fs");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
//bcrypt for encrypting password
const bcrypt = require("bcrypt");
const { use } = require("../route/userManagementRoute");
const pool = require("../model/db_config");
const { count } = require("console");
exports.checkPasswordServices=async(id)=>{
let userId=id
  const client = await pool.connect();
  const checkPassword=await client.query("select password from userschema.users where user_id=$1 and del=$2",[userId,'0']);
  // console.log(checkPassword.rows[0].password)
  const result=(await checkPassword.rows[0].password)
  client.release();
  return result ;
}
exports.createUserServices = async (bodyData,bcryptPassword) => {
  // console.log(bcryptPassword)
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryText =
      "insert into userschema.users (first_name, last_name,date_of_birth, gender, email, password) values($1,$2,$3,$4,$5,$6) RETURNING user_id";
    const res = await client.query(queryText, [
      bodyData.first_name,
      bodyData.last_name,
      bodyData.date_of_birth,
      bodyData.gender,
      bodyData.email,
      bcryptPassword,
    ]);
    const insertAddressText =
      "INSERT INTO userschema.address(apartment_name,street,landmark,pin_code,city,del,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7)RETURNING user_id";
    const addResponse = await client.query(insertAddressText, [
      bodyData.apartment,
      bodyData.street,
      bodyData.landmark,
      bodyData.pin_code,
      bodyData.city,
      "0",
      res.rows[0].user_id,
    ]);

    const insertStateText =
      "INSERT INTO userschema.states(user_id,state_name) VALUES ($1,$2)";
    const resPost = await client.query(insertStateText, [
      addResponse.rows[0].user_id,
      bodyData.state_name,
    ]);
    await client.query("COMMIT");
    return resPost;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

//get all data services
exports.getAllUserServices = async () => {
  const client = await pool.connect();
  let result = await client.query(
    "select users.user_id,users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,users.password,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id "
  );
  client.release();
  return await result.rows;
};
//GET method for pagination data
exports.getPaginationDataServices = async (pageValue, limitValue, data) => {
  let page =   parseInt(pageValue);
  let limit =  parseInt(limitValue);
  const client = await pool.connect();
  let totalUsers = await client.query(
    "select count(*) from userschema.users where del=$1",['0']);
  let result = await client.query(
    "select users.user_id,users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id where users.del=$1 order by user_id desc limit $3 offset (($2 - 1) * $3)",['0',page,limit]
  );
    // console.log(result)
  client.release();
  const existUsers = await result.rows;
  let totalRecords = await totalUsers.rows[0].count;
  // console.log(await totalUsers.rows[0].count)
  paginationData =await result.rows;
  return {
    paginationData,
    totalRecords,
     existUsers,
  };
};

exports.getSearchedUserServices=async(email)=>{
  let bdata=email
  const client = await pool.connect();
  const searchEmail=await client.query("select users.user_id,users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,users.password,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id where email like $1 and users.del=$2 ",[`%${bdata}%`,'0']);
  const result=(await searchEmail)
  // console.log(await result)
  client.release();
  return result ;
}

exports.updateUserServices=async(bodyData,id,newPassword)=>{
  let userId=id
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (bodyData.oldPassword==="") {
      console.log("inside blank password")
      const queryText =
      "update userschema.users set first_name=$1, last_name=$2,date_of_birth=$3, gender=$4, email=$5 where user_id=$6 ";
      const res = await client.query(queryText, [bodyData.first_name,
      bodyData.last_name,
      bodyData.date_of_birth,
      bodyData.gender,
      bodyData.email,
      userId
    ]);
    } else {
      console.log("inside new password")
      const queryText =
      "update userschema.users set first_name=$1, last_name=$2,date_of_birth=$3, gender=$4, email=$5, password=$6 where user_id=$7 ";
      const res = await client.query(queryText, [bodyData.first_name,
      bodyData.last_name,
      bodyData.date_of_birth,
      bodyData.gender,
      bodyData.email,
      newPassword,
      userId
    ]);
    }
    const insertAddressText =
      "update userschema.address set apartment_name=$1,street=$2,landmark=$3,pin_code=$4,city=$5 where user_id=$6 ";
    // const insertAddressValues = [  bodyData.apartment,
    //   bodyData.street,
    //   bodyData.landmark,
    //   bodyData.pin,
    //   bodyData.city,
    //   '0',
    //   res.rows[0].user_id]
    const addResponse = await client.query(insertAddressText, [
      bodyData.apartment,
      bodyData.street,
      bodyData.landmark,
      bodyData.pin_code,
      bodyData.city,
      userId,
    ]);

    const insertStateText =
      "update userschema.states set state_name=$1 where user_id=$2";
    // const insertStateValues = [addResponse.rows[0].address_id,bodyData.state]
    const resPost = await client.query(insertStateText, [
      bodyData.state_name,
      userId
    ]);
    await client.query("COMMIT");
    return resPost;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

exports.updateUserDataService = (userId, body) => {
  const existingUser = readUserDataFromJsonFile();
  let id = userId;
  let bodyData = body;
  if (
    bodyData.first_name.trim() === "" ||
    !validator.isAlpha(bodyData.first_name) ||
    bodyData.last_name.trim() === "" ||
    !validator.isAlpha(bodyData.last_name) ||
    !validator.isEmail(bodyData.email)
  ) {
    return { success: false, error: `Please Enter Valid Data!` };
  } else {
    let user = existingUser.find((user) => user.id === id);
    if (bodyData.first_name) user.first_name = bodyData.first_name;
    // if (bodyData.middleName)  user.middleName = bodyData.middleName;
    if (bodyData.last_name) user.last_name = bodyData.last_name;
    if (bodyData.gender) user.gender = bodyData.gender;
    if (bodyData.dateOfBirth) user.dateOfBirth = bodyData.dateOfBirth;
    if (bodyData.email) user.email = bodyData.email;
    if (bodyData.password)
      user.password = bcrypt.hashSync(bodyData.password, 10);
    if (bodyData.address) user.address = bodyData.address;
    if (bodyData.street) user.street = bodyData.street;
    if (bodyData.landmark) user.landmark = bodyData.landmark;
    if (bodyData.city) user.city = bodyData.city;
    if (bodyData.state) user.state = bodyData.state;
    if (bodyData.pin) user.pin = bodyData.pin;
    // if (bodyData.state)  user.state = bodyData.state;
    // if (bodyData.pinCode)  user.pinCode = bodyData.pinCode;
    else {
      return { success: false, body: `Record Not Found!` };
    }
    writeUserDataInJsonFile(existingUser);
    return { success: true, body: `User Data Updated Successfully!` };
  }
};
//delete single record services
exports.deleteUserServices = async (id) => {
  const userId = id;
  console.log(userId)
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const queryText =
      "update userschema.users set del=$1 where user_id=$2 ";
      const res = await client.query(queryText, ['1',userId]);
    const insertAddressText =
      "update userschema.address set del=$1 where user_id=$2 ";
    const addResponse = await client.query(insertAddressText, ['1',userId]);
    const insertStateText =
      "update userschema.states set del=$1 where user_id=$2";
    // const insertStateValues = [addResponse.rows[0].address_id,bodyData.state]
    const resDelete = await client.query(insertStateText, ['1',userId]);
    await client.query("COMMIT");
    //  console.log(resDelete.rowCount)
     return resDelete.rowCount;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

