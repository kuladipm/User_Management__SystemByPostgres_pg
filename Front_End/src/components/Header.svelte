<script>
  import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
const displayBlockStatus=()=>{
    dispatch("onAdd",{displayBlock : "addUserButtonClicked"})
}
const homeButtonAction=()=>{
    dispatch("onHome",{displayBlock : "addUserButtonClicked"})
}
// let searchBValue="";
// const searchFunction=()=>{
//     dispatch("onSearch",{searchBValue : searchBValue})
// }
</script>
<header>
    <div class="mainHeading">
      <div class="headingName">User Management</div>
    </div>
    <div>
      <!-- <input type="search" id="searchBar" placeholder="search by email" style="padding-bottom: 0px;text-align: center ;" bind:value={searchBValue}/>
      <button type="button" id="searchBtn " style="padding-bottom: 0px;text-align: center;" on:click={searchFunction(searchBValue)}>
      <i class="fas fa-search"></i>
    </button> -->
      <button
      class="addNewUserButton"
      on:click={displayBlockStatus}
      ><i class="material-icons">&#xE147;</i>Add New User</button
    >
      <button
        class="home"
        on:click={homeButtonAction}
        ><i class="material-icons">home</i>Home</button
      >
    </div>
  </header>
  <style>
      .mainHeading {
    gap: 60px;
  }
  .headingName {
    font-size: 27px;
    font-weight: 600;
    color: white;
  }

    header {
    height: 70px;
    width: 100vw;
    padding: 0 30px;
    padding-right: 10px;
    background-color:#3199f6;
    position: absolute;
    z-index: 100;
    box-shadow: 1px 1px 15px rgba(161, 182, 253, 0.825);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .addNewUserButton ,.home{
    /* width: 110px;
    height: 32px;
    display: flex;
    
  
    color: white;
    border-radius: 50px 50px;
    background-color: rgb(32, 32, 241);
    cursor: pointer; */
    align-items: center;
    justify-content: center;
    color: #566787;
    float: right;
    font-size: 13px;
    background: #fff;
    border: none;
    width: 150px;
    min-width: 50px;
    border-radius: 2px;
    height: 32px;
    display: flex;
    border: none;
    margin-left: 10px;
    font-family: "Varela Round", sans-serif;
  }
  .addNewUserButton:hover ,.home:hover{
    background-color: rgb(206, 206, 210);
  }
  .mainHeading{
    font-family: "Varela Round", sans-serif;
  }
  
  </style>