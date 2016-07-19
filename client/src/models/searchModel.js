//var portfolio_json             = require('../../data/portfolioData.json');
import {algoliasearch }           from 'algoliasearch'
import algoliasearchHelper      from 'algoliasearch-helper'

export class SearchModel {

    /* @ngInject */
    constructor(Network, GLOBALS, $q, Auth, algolia) {
        this.Network = Network;
        this.ModelPaginationPointer = 0;
        this.GLOBALS = GLOBALS;

        this.$q = $q;
        this.Auth = Auth;
        this.algolia = algolia;
        this.algoliaQueryParam = {
            "getRankingInfo": 1,
            "facets": "*",
            "attributesToRetrieve": "*",
            "highlightPreTag": "<em>",
            "highlightPostTag": "</em>",
            "hitsPerPage": 10,
            "facetFilters": [],
            "maxValuesPerFacet": 100,
            "typoTolerance" : false
        };


        this.client = this.algolia.Client('2K1ULUZLUW', '16f42d05d731eaf17e018a0442ff1fb2');
        this.index = this.client.initIndex('group');



        this.searchResult = {};
        this.fsResult = {};
    }


    setModel(value) {
        this.searchResult = value;
        this.ModelPaginationPointer = 0;

    }

    getModelValue() {
        return this.searchResult;
    }

    getModelPagination() {
        let SeaerchResult = [];
        let index = 0;
        for (var i = ModelPaginationPointer; i < this.GLOBALS.SeaechResultAmount; i++) {
            this.searchResult[index] = this.searchResult[i];
            ModelPaginationPointer++
            index++;
        }


    }

    get(query) {
        return this.index.search(query , this.algoliaQueryParam).
            then((content, err) => {
                //sort according to userScore
                content = this.userScoreRort(content);
                const searchresult_data = content;
                angular.copy(content, this.searchResult);
                return searchresult_data;
            });
    }

    getById(objectId) {
        return this.index.getObject(objectId).
            then((content, err) => {
                const searchFsresult_data = content;
                angular.copy(content, this.fsResult);
                return searchFsresult_data;
            });
    }


    userScoreRort(content){
        content.hits.sort(function (a, b) {
            if (a._rankingInfo.userScore > b._rankingInfo.userScore) {
                return -1;
            }
            if (a._rankingInfo.userScore < b._rankingInfo.userScore) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });

        return content;
    }

    getIndex(objectId){
        debugger;
    }






}
