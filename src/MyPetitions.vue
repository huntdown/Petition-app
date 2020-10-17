<template >
  <div>
    <div>
      <nav-bar-module></nav-bar-module>
    </div>

    <div id="top-container">
      <!--Search box-->
      <div>
        <form class="form-inline" role="form" @submit.prevent="searchPetitions(searchString)">
          <div class="form-group">
            <label class="sr-only" for="name">name</label>
            <input type="text" class="form-control" v-model="searchString" placeholder="Search title...">
          </div>
          <button type="submit" class="btn btn-primary" id="search-btn">Search</button>
        </form>
      </div>

      <!--Category Filter-->
      <div class="btn-group dropdown" id="filter">
        <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          {{ selectedCategoryName }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          <li role="presentation" v-for="category in categoryObjs" style="cursor:pointer;pointer-events: auto;">
            <a role="menuitem" tabindex="-1" id="category-item" @click="filterCategories(category.categoryId, category.name)">
              {{ category.name }}</a>
          </li>
        </ul>
      </div>

      <!--Sortby Filter-->
      <label id="sortByTitle">Sort By: </label>
      <div class="btn-group dropdown" id="sortByBtn">
        <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          {{ selectedSortByTypeValue }}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          <li role="presentation" v-for="type in sortByTypes" style="cursor:pointer;pointer-events: auto;">
            <a role="menuitem" tabindex="-1" id="sort-item" @click="sortBy(type.key, type.value)">{{ type.value }}</a>
          </li>
        </ul>
      </div>

    </div>


    <!--Petitions display-->
    <div class="petitions">
      <ul class="list-group" v-for="petition in petitionPerpage">
        <li class="list-group-item" id="petition-item">
          <div @click="viewPetitionDetail(petition.petitionId)">
            <img class="petition-thumbnail" :src="'http://localhost:4941/api/v1/petitions/' + petition.petitionId + '/photo'">
          </div>
          <div class="list-group-item-heading" >
            <span>
              <a class="petition-heading" @click="viewPetitionDetail(petition.petitionId)">
                {{petition.title}}
              </a>
            </span>
          </div>

          <p class="petition-info">
            Category: {{petition.category}}
          </p>

          <p class="petition-info">
            Auther's: {{petition.authorName}}
          </p>

          <p class="petition-info">
            Number of signature: {{petition.signatureCount}}
          </p>

        </li>
      </ul>
    </div>

    <!--paging-->
    <div>
      <nav aria-label="Page navigation example" >
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" @click="prevPage">Previous</a>
          </li>
          <li class="page-item" v-for="page in pages" v-bind:key="page">
            <a class="page-link" @click="navigatePage(page)">{{page}}</a>
          </li>
          <li class="page-item">
            <a class="page-link" @click="nextPage">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
  import navBarModule from './NavBar.vue'

  export default {
        name: "MyPetitions",

    components: {
      navBarModule
    },

    data(){
      return{
        error: "",
        errorFlag: false,
        petitions: [],
        query: "",
        selectedCategoryId: 0,
        selectedSortByTypeKey: "SIGNATURES_DESC",
        rootUrl:"http://localhost:4941/api/v1/petitions",
        count: 10,
        pages: [],
        page: 1,
        selectedCategoryName: "All categories",
        categoryObjs: [],
        selectedCategoryId: 0,
        selectedSortByTypeValue: "Number of signatures, most to least",
        sortByTypes: [{key: "SIGNATURES_DESC", value: "Number of signatures, most to least"},
          {key: "SIGNATURES_ASC", value: "Number of signatures, least to most"},
          {key: "ALPHABETICAL_ASC", value: "Alphabetically by title, A-Z"},
          {key: "ALPHABETICAL_DESC", value: "Alphabetically by title, Z-A"}],
        searchString: "",
      }

    },
    mounted() {
      this.getCategories();
      this.getPetitions(0, -1, this.query, this.selectedCategoryId, this.selectedSortByTypeKey);
    },
    methods:{
      getPetitions:function (startIndex, count, query, categoryId, sortBy) {
        let userId = parseInt(this.$cookies.get("seng365_cookie").userId);
        let url = `?startIndex=${startIndex}&sortBy=${sortBy}&authorId=${userId}`;

        if (count != -1)
        {
          url += `&count=${count}`;
        }
        if (query.length != 0)
        {
          url += `&q=${query}`;
        }
        if (categoryId != 0)
        {
          url += `&categoryId=${categoryId}`;
        }


        this.$http.get(this.rootUrl + url)
          .then((response)=>{
            this.petitions = response.data;
            this.getCategories();
            this.setPages();
          })
          .catch((error)=>{
            this.error = error;
            this.errorFlag = true;
            alert(error.statusText);
          });
      },

      getCategories: function() {
        let url = "/categories";
        this.$http.get(this.rootUrl + url)
          .then((response)=>{
            this.categoryObjs = [{categoryId: 0, name: "All categories" }]
            this.categoryObjs = this.categoryObjs.concat(response.data);
          })
          .catch((error)=>{
            this.error = error;
            this.errorFlag = true;
            alert(error.statusText);
          });
      },

      nextPage: function () {
        let numberOfPages = Math.ceil(this.petitions.length / this.count);
        if (this.page * this.count < this.petitions.length) {
          this.page++;

        } else {
          alert("Last page reached")
        }


      },
      prevPage: function () {
        if (this.page > 1)
          this.page--;
      },
      setPages: function () {
        let numberOfPages = Math.ceil(this.petitions.length / this.count);
        this.pages.splice(0, this.pages.length);
        for (let index = 1; index <= numberOfPages; index++) {
          this.pages.push(index);

        }
      },
      navigatePage: function (index) {
        this.page = index;
      },

      viewPetitionDetail:function (id, image) {
        this.$router.push({path: `/petition/${id}`, params:{petitionId: id}});
      },

      searchPetitions:function (query) {
        this.query = query === undefined ? "" : query;
        this.getPetitions(0, -1, this.query, this.selectedCategoryId, this.selectedSortByTypeKey);
      },

      filterCategories: function (id, name) {
        if(this.selectedCategoryId != id)
        {
          this.selectedCategoryId = id;
          this.selectedCategoryName = name;
        }
      },
      sortBy: function (key, value) {
        if (this.selectedSortByTypeKey != key)
        {
          this.selectedSortByTypeKey = key;
          this.selectedSortByTypeValue = value;
          this.getPetitions(0, -1, this.query, this.selectedCategoryId, this.selectedSortByTypeKey);
        }
      },
      viewPetitionDetail: function(id, image) {
        this.$router.push({ path: `/petitions/${id}`, params:{petitionId: id}});
      }


    },
    computed:{
      petitionPerpage: function () {
        return this.petitions.filter((row, index) => {
          let from = (this.page - 1) * this.count;
          let to = this.page * this.count;
          if (index >= from && index < to)
            return true;
        });
      },
    }
  }
</script>

<style scoped>
  div.pagination {
    display: flex;
    justify-content: center;
  }

  .petitions {
    margin-left:20%;
    margin-right:20%;
  }

  #petition-item {
    height: 200px;
  }

  .petition-thumbnail {
    float:left;
    height:180px;
    width:320px;
    overflow: auto;
  }

  .petition-heading {
    font-size: x-large;
    font-weight: bold;
    color: green;
    cursor:pointer;
    pointer-events: auto;
  }

  .petition-readmore {
    font-size: medium;
    color: gray;
    cursor:pointer;
    pointer-events: auto;
  }

  .petition-info {
    font-size: medium;
    font-weight: bold;
    margin-top: 20px;
  }

  #top-container {
    margin-top:20px;
    display: flex;
    justify-content: center;
  }

  #filter {
    margin-left: 20px;
  }

  #sortByBtn {
    margin-left: 0px;
  }

  #dropdownMenu1{
    font-weight: bold;
  }

  #search-btn {
    font-weight: bold;
  }

  #category-item {
    font-weight: bold;
  }

  #sort-item {
    font-weight: bold;
  }

  #sortByTitle {
    margin-left: 20px;
    margin-right: 5px;
    margin-top: 14px;
    justify-content: center;
  }

</style>
