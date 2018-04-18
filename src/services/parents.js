const apis = {
    list:{
        api:"/api/services/app/family/GetGuardianList",
        method:"POST",
        isBody:true
    },
    check:{
        api:"/api/services/app/family/AddOrUpdateGuardian",
        method:"POST",
        isBody:true
    },
    del:{
        api:"/api/services/app/family/DeleteGuardian",
        method:"DELETE"
    },
    detail:{
        api:"/api/services/app/family/GetGuardianDetails"
    }
}

export default apis;