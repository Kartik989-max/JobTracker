const {v4} = require('uuid')

const sessionToUserMap = new Map();
function setUser(id,user){
    sessionToUserMap.set(id,user)
}
function getUser(id,user){
    sessionToUserMap.get(id,user)
}
module.exports={getUser,setUser}