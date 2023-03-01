
const express = require('express')
const userManagementRoute = express.Router()
const { createUser,getAllUser,updateUser,getPaginationData,deleteUser,getSearchedUser} = require('../controller/userManagementController')
//router.use(express.json())
/* Create - POST method */
userManagementRoute.post('/', createUser)
/* Read - GET method for specific first_name data */
userManagementRoute.get('/:email', getSearchedUser)
// /* Read - GET method  for all data*/
userManagementRoute.get('/', getAllUser)
// /* Read - GET method  for pagination*/
userManagementRoute.get('/data/paginate', getPaginationData)
// /* Update - Patch method */
userManagementRoute.patch('/:id', updateUser)
// /* Delete  - Delete method */
 userManagementRoute.delete('/:id', deleteUser)
module.exports = userManagementRoute
