const mongoClient = require('../clients/mongoDbClient').getInstance();
let instance;

class Assignment {


  async fullTextSearch(params) {
    try {
      const {post: {searchText}, ip} = params;
      // console.log(body, query, params.post, 'params');
      const query = {$text: {$search: searchText}};
      const score = {score: {$meta: "textScore"}};

      const response = await mongoClient.executeSearchQuery(query, score);
      const updatedResponse = response.map(a => {
        let highlight = false;
        if (a.dictionary && a.dictionary.indexOf(ip) > -1) {
          highlight = true;
        }
        return {...a, highlight};
      });
      return {code: 200, data: updatedResponse};
    } catch (e) {
      console.log(e, this.fullTextSearch.name);
      throw {code: 400, msg: `something went wrong: ${e} `}
    }
  }

  async getItemById(params) {
    try {
      const {post: {id},} = params;
      if (!id || Number.isNaN(Number(id))) {
        return {code: 400, msg: 'id is mandatory'}
      }
      // console.log(body, query, params.post, 'params');
      const query = {ID: Number(id)};
      const response = await mongoClient.executeQuery(query);
      await this.updateToDictionary(params);
      return {code: 200, data: response};
    } catch (e) {
      console.log(e, this.fullTextSearch.name);
      return {code: 400, msg: `something went wrong: ${e} `}
    }
  }

  async updateToDictionary(params) {
    try {
      const {post: {id}, ip} = params;
      if (!id || Number.isNaN(Number(id))) {
        return {code: 400, msg: 'id is mandatory'}
      }
      // console.log(body, query, params.post, 'params');
      const query = {ID: Number(id)};
      const updateQuery = {
        $addToSet: {dictionary: ip}
      };
      const response = await mongoClient.executeUpdateQuery(query, updateQuery);
      console.log(response, 'updateResponse');
      return {code: 200, data: response};
    } catch (e) {
      console.log(e, this.fullTextSearch.name);
      throw {code: 400, msg: `something went wrong: ${e} `}
    }
  }


  static getInstance() {

    if (!instance) {
      instance = new Assignment();
    }
    return instance;
  }

}

exports.getInstance = Assignment.getInstance;
