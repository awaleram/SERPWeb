


(function () {
    'use strict';
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var app= angular.module('myApp.controller');
    app.controller('shgEligibleForVlrController', ['Base64', '$scope', '$http', function(Base64, $scope, $http) {

        $scope.districts = [];
        $scope.areaClusters = [];
        $scope.mandals = [];
        $scope.communityClusters = [];
        $scope.panchayats = [];
        $scope.vos = [];
        $scope.shgs = [];
        $scope.socialCategories= [];
        $scope.tempDistricts = [];
        $scope.tempMandals = [];
        $scope.tempPanchayats = [];
        $scope.tempVos = [];
        $scope.tempShgs = [];

        $scope.headerValue='Andhra Pradesh';

        $scope.districtCode = -1;
        $scope.districtName = '';
        $scope.areaClusterCode = -1;
        $scope.areaClusterName = '';
        $scope.mandalCode = -1;
        $scope.mandalName = '';
        $scope.communityClusterCode = -1;
        $scope.communityClusterName = -1;
        $scope.panchayatCode = -1;
        $scope.panchayatName = '';
        $scope.voCode = -1;
        $scope.voName = '';
        $scope.shgCode = -1;
        $scope.shgName = '';
        $scope.socialCategoryCode = -1;

        $scope.showDistricts = false;
        $scope.showAreaClusters = false;
        $scope.showMandals = false;
        $scope.showPanchayat = false;
        $scope.showCommunityClusters = false;
        $scope.showVOs = false;
        $scope.showSHGs = false;
        $scope.showFilter = false;
        $scope.showBack = false;

        $scope.startdate = '';
        $scope.enddate = '';
        $scope.homeshow = true;
        $scope.resultshow = false;
        var d=new Date(); // current date
        d.setDate(1); // going to 1st of the month
        d.setHours(-1);

        $scope.enddate = moment().subtract(1,'months').endOf('month').format('DD-MMM-YYYY');
        $scope.startdate = moment().subtract(6,'months').startOf('month').format("DD-MMM-YYYY");
        var options = {};

        $scope.submit = function() {
            var startDate = moment($scope.startdate, "DD-MMM-YYYY").format("YYYY-MM-DD");
            var endDate = moment($scope.enddate, "DD-MMM-YYYY").format("YYYY-MM-DD");
            $scope.filterText = '';
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/Shg%20Vlr%20Data?tenantIdentifier=default&R_startDate=' + startDate + '&R_endDate=' + endDate + '&locale=en&R_districts=' + $scope.districtCode + '&R_mandals=' + $scope.mandalCode + '&R_states=-1&R_vos=' + $scope.voCode + '&R_Shgs=' + $scope.shgCode + '&R_SocialCategory=' + $scope.socialCategoryCode + '&R_panchayats=' + $scope.panchayatCode + '&R_areaCluster=' + $scope.areaClusterCode + '&R_communityCluster=' + $scope.communityClusterCode).success(function (data) {
                $scope.resultshow = true;
                $scope.report = data;
                $scope.reportHeaders = data.columnHeaders;
                $scope.reportHeaderValues = [];
                var reportDataValues = [];
                var reportDataValues2 = [];
                for (var i = 0; i < $scope.report.data.length; i++) {

                    $scope.report.data[i].row[1] = parseFloat($scope.report.data[i].row[1]).toFixed(2);
                  //  $scope.report.data[i].row[2] = numberWithCommas($scope.report.data[i].row[2]);
                  /*  $scope.report.data[i].row[3] = numberWithCommas($scope.report.data[i].row[3]);
                    $scope.report.data[i].row[4] = parseFloat($scope.report.data[i].row[4]).toFixed(2);
                    $scope.report.data[i].row[5] = parseFloat($scope.report.data[i].row[5]).toFixed(2);*/
                    //$scope.report.data[i].row[3] = $scope.report.data[i].row[3].toFixed(2);

                    $scope.reportHeaderValues.push($scope.report.data[i].row[0]);
                    reportDataValues.push({
                        y: parseFloat($scope.report.data[i].row[1])
                    });
                    reportDataValues2.push({
                            y: parseFloat($scope.report.data[i].row[1])
                        }
                    );
                }

                options = {
                    chart: {
                        height: 300
                    },
                    title: {
                        text: '% of Eligible SHG for VLR'
                    },
                    xAxis: {
                        categories: $scope.reportHeaderValues
                    },

                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: $scope.headerValue,
                        data: reportDataValues
                    }]
                };
                options.chart.renderTo = 'container10';
                options.chart.type = 'line';
                var chart1 = new Highcharts.Chart(options);
            });
        };

        $scope.chartLine= function(){
            options.chart.type = 'line';
            var chart1 = new Highcharts.Chart(options);
        };

        $scope.chartBar= function(){
            options.chart.type = 'column';
            var chart1 = new Highcharts.Chart(options);
        };

        $scope.submitDate= function(){
            $scope.submit();
        };

        $scope.getSocialCategory= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getSocialCategory?tenantIdentifier=default&&locale=en').success(function (data) {
                $scope.socialCategories= [];
                $scope.socialCategories.push({
                    id: -1,
                    name: 'ALL'
                });
                for (var i = 0; i < data.data.length; i++) {
                    $scope.socialCategories.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }

            });
        };

        $scope.getAllDistricts= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/GetDistricts?tenantIdentifier=default&&locale=en').success(function (data) {
                $scope.districts= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.districts.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }
                $scope.tempDistricts = angular.copy($scope.districts);
            });
        };

        $scope.getAreaClustersForADistrict= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getAreaClusters?tenantIdentifier=default&R_districts=' + $scope.districtCode + '&locale=en').success(function (data) {
                $scope.areaClusters= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.areaClusters.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }
            });
        };

        $scope.getMandalsForADistrict= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/GetMandals?tenantIdentifier=default&R_districts=' + $scope.districtCode + '&R_areaCluster='+ $scope.areaClusterCode + '&locale=en').success(function (data) {
                $scope.mandals= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.mandals.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }
                $scope.tempMandals = angular.copy($scope.mandals);
            });
        };

        $scope.getCommunityClustersForAMandal= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getCommunityClusters?tenantIdentifier=default&R_mandals=' + $scope.mandalCode + '&locale=en').success(function (data) {
                $scope.communityClusters= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.communityClusters.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }
            });
        };

        $scope.getPanchayatForAMandal= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getPanchayat?tenantIdentifier=default&R_mandals=' + $scope.mandalCode + '&locale=en').success(function (data) {
                $scope.panchayats= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.panchayats.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1]
                    });
                }
                $scope.tempPanchayats = angular.copy($scope.panchayats);
            });
        };

        $scope.getVOForAPanchayat= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getVO?tenantIdentifier=default&R_panchayats=' + $scope.panchayatCode + '&R_communityCluster=' + $scope.communityClusterCode + '&locale=en').success(function (data) {
                $scope.vos= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.vos.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1].trim()
                    });
                }
                $scope.tempVos = angular.copy($scope.vos);
            });

        };

        $scope.getSHGForAVO= function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"}; //you probably don't need this line.  This lets me connect to my server on a different domain
            $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('mifos' + ':' + 'password');
            $http.get('https://localhost:8443/mifosng-provider/api/v1/runreports/getSHG?tenantIdentifier=default&R_vos=' + $scope.voCode + '&locale=en').success(function (data) {
                $scope.shgs= [];
                for (var i = 0; i < data.data.length; i++) {
                    $scope.shgs.push({
                        id: data.data[i].row[0],
                        name: data.data[i].row[1].trim()
                    });
                }
                $scope.tempShgs = angular.copy($scope.shgs);
            });

        };

        $scope.back=function(){
            if($scope.shgCode > -1){
                $scope.shgCode = -1;
                $scope.showSHGs = true;
                $scope.headerValue = $scope.voName;
                $scope.submit();

            } else if($scope.voCode > -1){
                $scope.voCode = -1;
                $scope.showSHGs = false;
                $scope.showVOs= true;
                $scope.vos = $scope.tempVos;
                $scope.headerValue = $scope.panchayatName;
                $scope.submit();
                $scope.shgs = [];

            } else if($scope.panchayatCode > -1){
                $scope.panchayatCode = -1;
                $scope.showVOs = false;
                $scope.showPanchayat= true;
                $scope.panchayats = $scope.tempPanchayats;
                $scope.headerValue = $scope.mandalName;
                $scope.submit();
                $scope.vos = [];

            } else if($scope.communityClusterCode > -1){
                $scope.communityClusterCode = -1;
                $scope.showVOs = false;
                $scope.showCommunityClusters= true;
                $scope.headerValue = $scope.mandalName;
                $scope.submit();
                $scope.vos = [];

            } else if($scope.mandalCode > -1){
                $scope.mandalCode = -1;
                $scope.showPanchayat = false;
                $scope.showCommunityClusters = false;
                $scope.showOptions = false;
                $scope.showMandals= true;
                $scope.mandals = $scope.tempMandals;
                if($scope.areaClusterCode > -1)
                    $scope.headerValue = $scope.areaClusterName;
                else
                    $scope.headerValue = $scope.districtName;
                $scope.submit();
                $scope.panchayats = [];
                $scope.communityClusters = [];

            }  else if($scope.areaClusterCode > -1){
                $scope.areaClusterCode = -1;
                $scope.showMandals = false;
                $scope.showAreaClusters= true;
                $scope.headerValue = $scope.districtName;
                $scope.submit();
                $scope.mandals = [];

            } else if($scope.districtCode > -1){
                $scope.districtCode = -1;
                $scope.showAreaClusters= false;
                $scope.showMandals = false;
                $scope.showDistricts= true;
                $scope.districts = $scope.tempDistricts;
                $scope.headerValue = "Andhra Pradesh";
                $scope.showBack = false;
                $scope.submit();
                $scope.areaCluster = [];
            }

        };



        $scope.submitDistrict = function(districtId, districtName){
            $scope.districtCode = districtId;
            $scope.districtName = districtName;
            $scope.headerValue = $scope.districtName;
            $scope.showDistricts = false;
            $scope.submit();
            $scope.getAreaClustersForADistrict();
            // $scope.getMandalsForADistrict();
            $scope.showBack = true;
            $scope.showAreaClusters = true;
            $scope.showFilter = true;
        };

        $scope.submitAreaClusters = function(areaClusterId, areaClusterName){
            $scope.areaClusterCode = areaClusterId;
            $scope.areaClusterName = areaClusterName;
            $scope.headerValue = $scope.areaClusterName;
            $scope.showAreaClusters = false;
            $scope.submit();
            $scope.getMandalsForADistrict();
            $scope.showMandals = true;
            $scope.showFilter = true;
        };

        $scope.submitMandals = function(mandalId, mandalName){
            $scope.mandalCode = mandalId;
            $scope.mandalName = mandalName;
            $scope.headerValue = $scope.mandalName;
            $scope.showMandals = false;
            $scope.submit();
            $scope.getPanchayatForAMandal();
            $scope.getCommunityClustersForAMandal();
            $scope.mandals=[];
            $scope.showOptions = true;
            $scope.showFilter = true;
        };

        $scope.submitPanchayatOption = function(){
            $scope.showOptions = false;
            $scope.showPanchayat = true;
        };

        $scope.submitCommunityClusterOption = function(){
            $scope.showOptions = false;
            $scope.showCommunityClusters = true;
        }

        $scope.submitPanchayats = function(panchayatId, panchayatName){
            $scope.panchayatCode = panchayatId;
            $scope.panchayatName = panchayatName;
            $scope.headerValue = $scope.panchayatName;
            $scope.showPanchayat = false;
            $scope.submit();
            $scope.getVOForAPanchayat();
            $scope.panchayats=[];
            $scope.showVOs = true;
            $scope.showFilter = true;

        };

        $scope.submitCommunityClusters = function(communityClusterId, communityClusterName){
            $scope.communityClusterCode = communityClusterId;
            $scope.communityClusterName = communityClusterName;
            $scope.headerValue = $scope.communityClusterName;
            $scope.showCommunityClusters = false;
            $scope.submit();
            $scope.getVOForAPanchayat();
            $scope.panchayats=[];
            $scope.showVOs = true;
            $scope.showFilter = true;

        };

        $scope.submitVOs = function(voId, voName){
            $scope.voCode = voId;
            $scope.voName = voName;
            $scope.headerValue = $scope.voName;
            //$scope.showVOs = false;
            $scope.submit();
            //$scope.getSHGForAVO();
            //$scope.vos=[];
            //$scope.showSHGs = true;
            $scope.showFilter = true;

        };

        $scope.submitSHG = function(shgId, shgName){
            $scope.shgCode = shgId;
            $scope.shgName = shgName;
            $scope.headerValue = $scope.shgName;
            $scope.submit();
            $scope.showSHGs = true;
            $scope.showFilter = true;

        };

        $scope.updateSocialCategory = function(){
            $scope.submit();


        };

        $scope.getSocialCategory();
        $scope.getAllDistricts();
        $scope.submit();
        $scope.showDistricts = true;
        $scope.showFilter = true;
        $scope.resultshow = true;

    }])
}());

