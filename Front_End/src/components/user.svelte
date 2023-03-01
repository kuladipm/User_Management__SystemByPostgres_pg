<script>
  // import userStoreData from "./store/userStore";
  import { onMount } from "svelte";
  import { Confirm } from "svelte-confirm";
  import Loader from "./Loader.svelte";
  import SvelteTooltip from 'svelte-tooltip';
  export let getData;
  export let postData;
  export let totalRecordsInDb;
  export let totalPages;
  export let recordsSeenInPage;
  export let page;
  export let searchData;
  let loading = true;
  var formatDate = (dateString) => {
    const date = new Date(dateString); // create a new Date object
    const day = date.getDate().toString().padStart(2, "0"); // get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // get month and pad with leading zero if necessary
    const year = date.getFullYear(); // get year
    return `${day}/${month}/${year}`; // concatenate day, month, and year in the desired format
  };

  const handlePrev = () => {
    dispatch("prev", { message: "prev" });
  };
  const handleNext = () => {
      dispatch("next", { message: "next" });
  };
  const handlePage = (page) => {
    if (page === 0) {
      page = 1;
    } else {
      page = page;
    }
    dispatch("page", page);
  };

  onMount(() => {
    if (searchData === "") {
      getData();
      setTimeout(() => {
        loading = false;
      }, 1000);
    }
    getData(searchData);
    setTimeout(() => {
      loading = false;
    }, 1000);
  });

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const updateData = (data) => {
    dispatch("onUpdate", data);
  };
  const DeleteData = (data) => {
    console.log(data);
    dispatch("onDelete", data);
  };

  let searchBValue = "";
  const searchFunction = () => {
    dispatch("onSearch", { searchBValue: searchBValue });
  };
</script>

{#if loading}
  <Loader />
{:else}
  <div class="main">
    <div class="report-container">
      <!-- <div class="report-header">
      <h1 class="users">Users</h1>
    </div> -->
      <div class="report-body">
        <input
          type="search"
          id="search-input"
          class="form-control col-md-3 float-right "
          bind:value={searchBValue}
          placeholder="search by email"
          on:keypress={(e) => {
            if (e.key === "Enter") {
              searchFunction();
            }
          }}
        />
        <table class="table table-striped table-hover">
          <thead class="align">
            <tr>
              <th>User Name</th>
              <!-- <th>Last Name</th> -->
              <th>Email</th>
              <th>Gender</th>
              <th>Date Of Birth</th>
              <th>Address</th>
              <th class="tableAction">Action</th>
            </tr>
          </thead><tbody>
            {#each postData as item}
              <tr>
                <td>{item.first_name} {item.last_name}</td>
                <!-- <td>{item.last_name}</td> -->
                <td>{item.email}</td>
                <td>{item.gender}</td>
                <td>{formatDate(item.date_of_birth)}</td>
                <td
                  >{item. apartment_name}, {item.street}, {item.landmark}, {item.city}, {item.state_name},
                  {item. pin_code}</td
                >
                <td class="wrapper">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  
                   
                  <!-- svelte-ignore missing-declaration -->
                  <SvelteTooltip tip="Edit" left color="black">
                  <element
                    on:click={updateData(item)}
                    class="material-symbols-outlined"
                    style="color: cornflowerblue;width: 20px;margin-right: 20px;cursor: pointer;"
                    >Settings</element
                  >
                </SvelteTooltip>
                  <Confirm
                    let:confirm={confirmThis}
                    confirmTitle="Delete"
                    cancelTitle="Cancel"
                    themeColor="250"
                  >
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <SvelteTooltip tip="Delete" left color="black">
                    <element on:click={() => confirmThis(DeleteData, item.user_id)}>
                      <i
                        class="material-icons"
                        title="delete"
                        style="color:red;cursor: pointer">cancel</i
                      >
                    </element>
                  </SvelteTooltip>
                    <span slot="title"> Delete this item? </span>
                    <span slot="description">
                      You won't be able to revert this!
                    </span>
                  </Confirm>
                </td>
              </tr>
            {:else}
              <h2>Loading...</h2>
            {/each}
          </tbody>
        </table>
        <div class="clearfix">
          <div class="hint-text">
            Showing <b>{(page - 1) * 5 + 1}</b> to
            <b>{(page - 1) * 5 + recordsSeenInPage}</b> entries out of
            <b>{totalRecordsInDb}</b>
          </div>
          <ul class="pagination">
            <li class="page-item">
              <a
                href="#"
                class={1 === page ? "invisible" : "page-link"}
                on:click={() => {
                  handlePrev();
                  loading = true;
                setTimeout(() => {
                  loading = false; 
                }, 1000);
                }}>Previous</a
              >
            </li>
            {#each Array(totalPages) as pbs, i}
              <li class={page === i ? "page-item active" : "page-item"}>
                <a
                  href="#"
                 
                  on:click={() => {
                    handlePage(i);
                    loading = true;
                  setTimeout(() => {
                    loading = false;
                  }, 500);
                  }} class="page-item">{i++ + 1}</a
                >
              </li>
            {/each}
            <li class="page-item">
              <!-- svelte-ignore a11y-invalid-attribute -->
              <a
                href="#"
                class={totalPages === page ? "invisible" : "page-link"}
                on:click={() => {
                  handleNext();
                  loading = true;
                setTimeout(() => {
                  loading = false;
                }, 500);
                }}>Next</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .pagination {
    float: right;
    margin: 0 0 5px;
    font-family: "Varela Round", sans-serif;
  }
  .pagination li a {
    border: none;
    font-size: 13px;
    min-width: 30px;
    min-height: 30px;
    color: #1e1919;
    margin: 0 2px;
    line-height: 30px;
    border-radius: 2px !important;
    text-align: center;
    padding: 2px 8px;
  }
  .pagination li a:hover {
    color: #666;
  }
  .pagination li.active a,
  .pagination li.active a.page-link {
    background: #03a9f4;
  }
  .pagination li.active a:hover {
    background: #0397d6;
  }
  .pagination li.disabled i {
    color: #ccc;
  }
  .pagination li i {
    font-size: 16px;
    padding-top: 6px;
  }
  .hint-text {
    float: left;
    margin-top: 10px;
    margin-left: 5px;
    font-size: 13px;
    font-family: "Varela Round", sans-serif;
  }
  .search-input{
    font-family: "Varela Round", sans-serif;
  }
  .wrapper{
    color:white
  }
  
</style>
