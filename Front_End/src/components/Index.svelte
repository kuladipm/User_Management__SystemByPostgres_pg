<script>
  import Header from "./Header.svelte";
  import User from "./user.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import FormBootstrap from "./FormBootstrap.svelte";
  //for rendering html code like form display we used displayBlock variable
  let displayBlock = "default";
  //for pagination we send page as number to params an this is reactive
  $: page = 1;
  //total records length stored in all record variable which is came from back end
  let totalRecordsInDb = "";
  //for showing how many record are displayed in a page out off total records
  let recordsSeenInPage = "";
  //for showing no of pages from all records by using math.ceil formula
  let totalPages = "";
  //main array
  let postData = [];
  let foundSearchData = [];
  let searchData = "";
  let loading = true;
//page variable we bind with page number method so that we handle pagination
  $: pageNumber = (e) => {
    if (e.detail.message === "next" && page < totalPages) {
      page++;
      console.log(e.detail);
      getData();
    } else if (e.detail.message === "prev" && page > 1 && page <= totalPages) {
      page--;
      getData();
      console.log("prev pressed");
    } else if (e.detail > 0 && e.detail <= totalPages) {
      console.log(e.detail + "pressed");
      page = e.detail;
      getData();
    }
  };
  //called get api through async and await and data is stored in array
  const getData = async () => {
    try {
    const res = await fetch(
      `http://localhost:3000/user/data/paginate?page=${page}&limit=5`,
      {
        method: "GET",
        headers: { "content-type": "application/json" },
      }  
    );
    console.log("i am here")
    const apiData = await res.json();
    console.log(apiData)
    postData = apiData.paginationData
    console.log(postData)
    totalRecordsInDb = apiData.totalRecords;
    console.log(apiData.existUsers.length)
    recordsSeenInPage = postData.length;
    
    totalPages = Math.ceil(totalRecordsInDb / 5);
  } catch (error) {
      console.log(error);
    } finally {
      () => {
        loading = false;
      };
    }
  };
  //when user clicked on addUser button called this function
  const addUserClicked = (e) => {
    displayBlock = "addUserButtonClicked";
  };
  const homeRender = () => {
    displayBlock = "homeButtonClicked";
  };
  //post api is called on registration form button action
  const postedData = async (e) => {
    let validateData = e.detail;
    console.log(validateData);
    if (
      e.detail.first_name === "" ||
      e.detail.last_name === "" ||
      e.detail.email === "" ||
      e.detail.date_of_birth === "" ||
      e.detail.password === "" ||
      e.detail.confirmPassword === "" ||
      e.detail.gender === "" ||
      e.detail.apartment === "" ||
      e.detail.state_name === "" ||
      e.detail.pin_code === "" ||
      e.detail.street === "" ||
      e.detail.city === "" ||
      e.detail.landmark === ""
    ) {
      toast.error("please enter all detail", {
        style:
          "border: 1px solid #713200; padding: 16px;width:60%; color: #713200;",
        position: "bottom-center",
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } else {
      displayBlock = "dataPosted";
      const res = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: e.detail.first_name.trim(),
          last_name: e.detail.last_name.trim(),
          email: e.detail.email.trim(),
          password: e.detail.password.trim(),
          gender: e.detail.gender,
          date_of_birth: e.detail.date_of_birth,
          apartment: e.detail.apartment.trim(),
          street: e.detail.street,
          landmark: e.detail.landmark,
          city: e.detail.city,
          state_name: e.detail.state_name,
          pin_code: e.detail.pin_code,
        }),
      });
      toast.success("user added successfully", {
        style:
          "border: 1px solid #713200; padding: 16px;width:60%; color: #greeny;",
        position: "bottom-center",
        iconTheme: {
          primary: "green",
          secondary: "#FFFAEE",
        },
      });
       await getData();
      return (await res).text();
    }
  };
  //delete api called on event handler of user delete button action
  const handleDeleteData = async (e) => {
    console.log(e.detail)
    try {
      const res=await fetch(`http://localhost:3000/user/${e.detail}`, 
      { method: "DELETE" 
    });
    const response = await res.text();
        let deleteId = "";
      for (let i = 0; i < postData.length; i++) {
        if (postData[i].id === e.detail) {
          deleteId = i;
        }
      }
      postData.splice(deleteId, 1);
      postData = postData;
      toast.success(`User Data Deleted Successfully`, {
        position: "bottom-center",
      });
      getData();
    } catch (error) {
      console.log(error);
    }
  };
  //update data api called on user update button action
  //userUpdateData variable take data which is updated and passing it to form fields for updating
  let userUpdateData;
  const handleUpdateData = (e) => {
    displayBlock = "updateData";
    userUpdateData = e.detail;
  };
  //updated data sending to api and display
  const updateData = (e) => {
    if (
      e.detail.first_name === "" ||
      e.detail.email === "" ||
      e.detail.date_of_birth === "" ||
      e.detail.gender === "" ||
      e.detail.apartment === "" ||
      e.detail.state === "" ||
      e.detail.pin === "" ||
      e.detail.street === "" ||
      e.detail.city === "" ||
      e.detail.landmark === ""
    ) {
      toast.error("please enter all detail", {
        style:
          "border: 1px solid #713200; padding: 16px;width:60%; color: #713200;",
        position: "bottom-center",
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    } else {
      displayBlock = "dataUpdated";
      let id = e.detail.id;
      let updateApiData = e.detail;
      console.log(id);
      fetch(`http://localhost:3000/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: updateApiData.first_name.trim(),
          last_name: updateApiData.last_name.trim(),
          email: updateApiData.email.trim(),
          oldPassword: updateApiData.oldPassword.trim(),
          newPassword: updateApiData.newPassword.trim(),
          gender: updateApiData.gender,
          date_of_birth: updateApiData.date_of_birth,
          apartment: updateApiData.apartment.trim(),
          street: updateApiData.street.trim(),
          landmark: updateApiData.landmark.trim(),
          city: updateApiData.city,
          state_name: updateApiData.state_name,
          pin_code: updateApiData.pin_code,
        }),
      })
        .then((response) => response.text())
        .then((result) =>getData())
        .then((val)=>console.log(val))
        .catch((e) => {
          console.log(e);
        });
    }
  };
  //get single user based on email
  const getSingleId = async (email) => {
    try {
      const url = `http://localhost:3000/user/${email}`;
      console.log(url);
      const res = await fetch(url, {
        method: "GET",
      });
      let apiData = await res.json();
      console.log(apiData)
      foundSearchData = apiData;
      console.log(foundSearchData);
      totalRecordsInDb = foundSearchData.length;
      recordsSeenInPage =totalRecordsInDb; 
      totalPages = 1;
      console.log();
    } catch (error) {
      console.log(error.text);
      toast.error(`Data Not Found`, {
        position: "bottom-center",
      });
      displayBlock = "dashboard";
    }
  };
    
  const searchUse=(e)=>{
    if (e.detail.searchBValue.trim()==="") {
      return ;
    } 
    searchData=e.detail.searchBValue.trim()
    displayBlock="searchDataField"
    
  }

</script>

<!-- for header part rendering -->
<Header on:onAdd={addUserClicked} on:onHome={homeRender} />
<div class="main-container">
  <Toaster />
  <!-- for displaying dashboard witch changing displayBlock status -->
  {#if displayBlock === "default" || displayBlock === "dataUpdated" || displayBlock === "dataPosted" || displayBlock === "homeButtonClicked"||displayBlock === "homeButtonClicked"}
    <User
      on:onDelete={handleDeleteData}
      on:onUpdate={handleUpdateData}
      {getData}
      {postData}
      {totalRecordsInDb}
      {recordsSeenInPage}
      {totalPages}
      {page}
      on:page={pageNumber}
      on:prev={pageNumber}
      on:next={pageNumber}
      on:onSearch={searchUse}
    />
  {:else if displayBlock === "searchDataField"}
    <User
      on:onDelete={handleDeleteData}
      on:onUpdate={handleUpdateData}
      postData={foundSearchData}
      getData={getSingleId}
      {searchData}
      {totalRecordsInDb}
      {recordsSeenInPage}
      {totalPages}
      {page}
      on:page={pageNumber}
      on:prev={pageNumber}
      on:next={pageNumber}
    />
  {:else if displayBlock === "addUserButtonClicked"}
    <FormBootstrap on:onPost={postedData} {displayBlock} />
  {:else if displayBlock === "updateData"}
    <!-- html form open when button clicked -->
    <FormBootstrap
      {userUpdateData}
      on:onUpdateData={updateData}
      {displayBlock}
    />
  {/if}
</div>

<style>
</style>
