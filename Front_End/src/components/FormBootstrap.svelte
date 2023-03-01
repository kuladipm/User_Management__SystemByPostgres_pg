<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let postData;
  export let userUpdateData;
  export let displayBlock;
  //for empty form field
  let blankField = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: " ",
    date_of_birth: "",
    apartment: "",
    street:"",
    landmark:"",
    city:"",
    state_name: "",
    pin_code: "",
  };
  let errors = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
    gender: " ",
    date_of_birth: "",
    apartment: "",
    street:"",
    landmark:"",
    city:"",
    state_name: "",
    pin_code: "",
  };

  //for updating we assign update data object to main object
  if (displayBlock === "updateData") {
    postData = userUpdateData={
      id:userUpdateData.user_id,
      first_name: userUpdateData.first_name,
      last_name: userUpdateData.last_name,
        email: userUpdateData.email,
        oldPassword:"",
        newPassword:"",
        gender: userUpdateData.gender,
        date_of_birth: userUpdateData.date_of_birth,
        apartment:userUpdateData.apartment_name,
          street:userUpdateData.street,
          landmark:userUpdateData.landmark,
          city:userUpdateData.city,
          state_name:userUpdateData.state_name,
          pin_code:userUpdateData.pin_code,
    }
    console.log(postData);
  } else {
    postData = blankField;
    console.log(postData);
  }
  //showing error below input field
  let valid = false;
  

  const validateEmail = (email) => {
    console.log(email);
    var emailRegEx =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegEx.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/.test(
      password
    );
  };
  const correctName = (name) => {
    return /^[A-Za-z]+$/.test(name);
  };
  const correctPin = (pin) => {
    return /^\d+$/.test(pin);
  };

  const formHandler = (event) => {
    //first name
    valid = true;
    if (
      !correctName(postData.first_name) ||
      postData.first_name.length < 1
    ) {
      valid = false;
      errors.first_name = "please enter valid first name";
    } else {
      errors.first_name = "";
    }
    //last name
    if (
      !correctName(postData.last_name) ||
      postData.last_name.length < 1
    ) {
      valid = false;
      errors.last_name = "please enter valid last name";
    } else {
      errors.last_name = "";
    }
    //email
    if (!validateEmail(postData.email) || postData.email.length < 1) {
      valid = false;
      errors.email = "email should be in proper format";
    } else {
      errors.email = "";
    }
    //date of birth
    if (postData.date_of_birth === "") {
      valid = false;
      errors.date_of_birth = "please select date of birth";
    } else {
      errors.date_of_birth = "";
    }
  
    //password validation
    if (displayBlock !== "updateData") {
    if (!validatePassword(postData.password)) {
      valid = false;
      errors.password =
        "password must be min 8 character & have upper,lower letter & special char & number";
    } else {
      errors.password = "";
    }
    //confirm password validation
    if (postData.password !== postData.confirmPassword) {
      valid = false;
      errors.confirmPassword = "password and confirm password are not match";
    } else {
      errors.confirmPassword = "";
    }
  }else{
    //update old and new password
if (postData.oldPassword===""&&postData.newPassword==="") {
  errors.oldPassword = "";
  errors.newPassword = "";
} else if (postData.oldPassword!==""&&postData.newPassword!==""){
  if (!validatePassword(postData.oldPassword)) {
      valid = false;
      errors.oldPassword =
        "password must be min 8 character & have upper,lower letter & special char & number";
    } else {
      errors.oldPassword = "";
    }
    //new password validation
    if (!validatePassword(postData.newPassword)) {
      valid = false;
      errors.newPassword = "new password must be min 8 character & have upper,lower letter & special char & number ";
    } else {
      errors.newPassword = "";
    }
  }
}
    //apartment
    if (postData.apartment.length < 1) {
      valid = false;
      errors.apartment = "please enter apartment";
    } else {
      errors.apartment = "";
    }
     //street
     if (postData.street.length < 1) {
      valid = false;
      errors.street = "please enter street";
    } else {
      errors.street = "";
    }
    //landmark
    if (postData.landmark === "") {
      valid = false;
      errors.landmark = "please enter landmark";
    } else {
      errors.landmark = "";
    }
    //city
    if (postData.city.length < 1) {
      valid = false;
      errors.city = "please select city";
    } else {
      errors.city = "";
    }
    //state
    if (postData.state_name === "") {
      valid = false;
      errors.state_name = "please select state";
    } else {
      errors.state_name = "";
    }
    //pin
    if (!correctPin(postData.pin_code)&&postData.pin_code.length !== 6) {
      valid = false;
      errors.pin_code = "enter 6 digit pin";
    } else {
      errors.pin_code = "";
    }
    //gender
    let genders = document.getElementsByName("inlineRadioOptions");
    if (genders[0].checked == ""&&genders[1].checked == "" && genders[2].checked == "") {
      valid = false;
      errors.gender = "please select gender";
    } else {
      errors.gender = "";
    }
    
    //event dispatcher dispatch update and post data
    if (valid) {
      event.preventDefault();
      console.log(postData);
      dispatch("onUpdateData", postData);
      dispatch("onPost", postData);
    } else {
      console.log("invalid input");
    }
  };
</script>

<div class="container col-10">
  <form id="userForm">
    <div class="form-row justify-content-center">
      <div class="form-group m-4 ">
        <h2 for="title">Registration</h2>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6 font-weight-bold">
        <label for="firstName">First Name<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="first_name"
          placeholder="Enter Your First Name"
          title="First Name"
          bind:value={postData.first_name}
          
        />
        <div class="error">{errors.first_name}</div>
      </div>
      <div class="form-group col-md-6 font-weight-bold">
        <label for="last_name">Last Name<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="last_name"
          placeholder="Enter Your Last Name"
          title="Last Name"
          bind:value={postData.last_name}
       
        />
        <div class="error">{errors.last_name}</div>
      </div>
    </div>
    <div class="form-row ">
      <div class="form-group col-md-6 font-weight-bold font-">
        <label for="email">Email<span style="color:red;font-size: 20px;"
          >*</span
        >:</label>
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="Enter Email"
          title="Email"
          bind:value={postData.email}
         
        />
        <div class="error">{errors.email}</div>
      </div>
      <div class="form-group col-md-6 font-weight-bold">
        <label for="date_of_birth">Date Of Birth<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="date_of_birth"
          placeholder="Select Date Of Birth"
          title="Date Of Birth"
          min="1990-01-01"
          max="2005-12-31"
          onfocus="(this.type='date')"
          bind:value={postData.date_of_birth}
         
        />
        <div class="error">{errors.date_of_birth}</div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6 ">
        <div class="form-check form-check-inline">
          <label class="form-check-label font-weight-bold" for="gender"
            >Gender<span style="color:red;font-size: 20px;">*&nbsp;</span>:&nbsp;&nbsp;</label
            >
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="male"
            value="Male"
            bind:group={postData.gender}
         
            
          />
          <label class="form-check-label" for="male">Male:</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="female"
            value="Female"
            bind:group={postData.gender}
       

          />
          <label class="form-check-label" for="female">Female:</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id="other"
            value="Other"
            bind:group={postData.gender}
        

          />
          <label class="form-check-label" for="other">Other</label>
        </div>
        <div class="error">{errors.gender}</div>
      </div>
    </div>
    {#if displayBlock === "updateData"}
    <div class="form-row">
      <div class="form-group col-md-6 font-weight-bold">
        <label for="oldPassword">Old Password<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="password"
          class="form-control"
          id="oldPassword"
          placeholder="Old Password"
          title="Old Password"
          bind:value={postData.oldPassword}
          
        />
        <div class="error">{errors.oldPassword}</div>
      </div>
      <div class="form-group col-md-6 font-weight-bold">
        <label for="new Password">New Password<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="password"
          class="form-control"
          id="newPassword"
          placeholder="New Password"
          title="New Password"
          bind:value={postData.newPassword}
         
        />
        <div class="error">{errors.newPassword}</div>
      </div>
    </div>
    {:else}
    <div class="form-row">
      <div class="form-group col-md-6 font-weight-bold">
        <label for="password">Password<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="password"
          class="form-control"
          id="password"
          placeholder="Password"
          title="Password"
          bind:value={postData.password}
          
        />
        <div class="error">{errors.password}</div>
      </div>
      <div class="form-group col-md-6 font-weight-bold">
        <label for="confirm Password">Confirm Password<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          placeholder="Confirm Password"
          title="Confirm Password"
          bind:value={postData.confirmPassword}
         
        />
        <div class="error">{errors.confirmPassword}</div>
      </div>
    </div>
    {/if}
   
    <div class="form-row">
      <div class="form-group col-md-4 font-weight-bold">
        <label for="inputapartment"
          >Building/Apartment<span style="color:red;font-size: 20px;">*</span
          >:</label
        >
        <input
          type="text"
          class="form-control"
          id="apartment"
          placeholder="Building/Apartment"
          title="Building/Apartment"
          bind:value={postData.apartment}
    

        />
        <div class="error">{errors.apartment}</div>
      </div>
      <div class="form-group col-md-4 font-weight-bold">
        <label for="street">Street Name or Locality<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="street"
          placeholder="Street Name Or Locality"
          title="Street"
          bind:value={postData.street}
         

        />
        <div class="error">{errors.street}</div>
      </div>
      <div class="form-group col-md-4 font-weight-bold">
        <label for="landmark">Landmark<span
          style="color:red;font-size: 20px;">*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="landmark"
          placeholder="Landmark"
          title="Landmark"
          bind:value={postData.landmark}
         

        />
        <div class="error">{errors.landmark}</div>
      </div>
      <div class="form-group col-md-4 font-weight-bold">
        <label for="city">City<span style="color:red;font-size: 20px;"
          >*</span
        >:</label>
       <input 
       type="text"
          class="form-control"
          id="City"
          placeholder="Enter City"
          title="City"
          bind:value={postData.city}
          />
        <div class="error">{errors.city}</div>
      </div>
      <div class="form-group col-md-4 font-weight-bold">
        <label for="state">State<span style="color:red;font-size: 20px;"
          >*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="state_name"
          placeholder="Enter State"
          title="State"
          bind:value={postData.state_name}
         
          />
        <div class="error">{errors.state_name}</div>
      </div>

      <div class="form-group col-md-4 font-weight-bold">
        <label for="pin">PIN<span style="color:red;font-size: 20px;"
          >*</span
        >:</label>
        <input
          type="text"
          class="form-control"
          id="pin_code"
          placeholder="Enter PIN"
          title="Pin"
          bind:value={postData.pin_code}
         
        />
        <div class="error">{errors.pin_code}</div>
      </div>
    </div>
   
    <div class="col text-center">
      <button
        type="submit"
        class="btn btn-primary "
        on:click|preventDefault={formHandler}>Submit</button
      >
    </div>
  </form>
</div>

<style>
  .error {
    font-weight: bold;
    font-size: 12px;
    color: red;
  }
  .form-group,.btn-primary {
    font-family: "Varela Round", sans-serif;
    color: #566787;
  }
  .btn-primary {
    font-family: "Varela Round", sans-serif;
    color: aliceblue;
  }
  
</style>
