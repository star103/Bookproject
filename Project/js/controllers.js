/**
 * Created by Administrator on 2018/1/8.
 */
(function(){
    angular.module('app.controllers',['app.services'])
        .controller('homeController',function($scope,homeService,$interval){
            //获取轮播广告
            $scope.sliderList=[];
            homeService.getSlider().then(function(response){
                if(response.data.Code==100){
                    for(var i=0;i<response.data.Data.length;i++){
                        $scope.sliderList = response.data.Data;
                        $scope.$watch($scope.sliderList,function(){
                            var imgs=document.querySelectorAll('.slider>img');
                            var index=0;
                            if($scope.sliderList){
                                $interval(function () {
                                    imgs[index].className='left-out';
                                    index++;
                                    if(index>=imgs.length){
                                        index=0;
                                    }
                                    imgs[index].className='right-in';
                                },2000)
                            }
                        })
                    }
                }
                //console.log(response);
            })
            //获取馆长推荐图书
            $scope.bookRecom=[];
            homeService.getRecomBook().then(function(response){
                if(response.data.Code==100){
                    $scope.bookRecom = response.data.Data;
                }
            })
        })
        .controller('sortController',function($scope,sortService){
            //获取图书类别
            $scope.bookSortList=[];
            sortService.getBookSort().then(function(response){
                //console.log(response)
                if(response.data.Code==100){
                    $scope.bookSortList = response.data.Data;
                }
            })
        })
        .controller('detailController',function($scope,$window,$location,detailService,$routeParams,shelfService){
            //获取图书详情
            $scope.bookDetail=[];
            detailService.getBookDetail($routeParams.id).then(function(response){
                if(response.data.Code==100){
                    $scope.bookDetail = response.data.Data;
                }
                //console.log($scope.bookDetail)
            })

            $scope.goBack=function(){
                history.back();
            }

            //点击借书架跳转
            $scope.goPageShelf=function(){
                if(null!=$window.localStorage.getItem('userInfo')){
                    $location.url('/pageShelf');
                    return;
                }
                $location.url('/login');
            }
            //加入借书架
            $scope.addShelf=function(bookObj){
                $scope.amountState=false;
                $scope.ownState=false;
                $scope.successState=false;
                $scope.failState=false;

                if(null==$window.localStorage.getItem('userInfo')){
                    $location.url('/login');
                    return;
                }

                //将数量存入localStorage
                //if(null!=$window.localStorage.getItem('shelfInfo')){
                //    $window.localStorage.setItem('shelfInfo',parseInt($window.localStorage.getItem('shelfInfo'))+1);
                //}else{
                //    $window.localStorage.setItem('shelfInfo',1);
                //}

                var bookDetail=[];

                //若无库存，提示
                if(!bookObj.Number){
                    $scope.amountState=true;
                    return;
                }

                var parameter={
                    readerId:JSON.parse($window.localStorage.getItem('userInfo')).Id,
                    bookId:$routeParams.id
                }
                //加入数据库
                shelfService.addShelfRequest(parameter).then(function(response){
                    console.log(response)
                    if(response.status==200&&response.data.Code==100){
                        $scope.successState=true;
                    }else if(response.data.Code==217){
                        $scope.ownState=true;
                    }
                    else{
                        $scope.failState=true;
                    }
                })
            }
        })
        .controller('bookListController',function($scope,homeService,$routeParams,sortService,bookListService){
            //根据馆长推荐获取图书列表
            //console.log($routeParams.sectionId)
            $scope.bookRecomList=[];

            if($routeParams.sectionId){
                homeService.getRecomId($routeParams.sectionId).then(function(response){
                    if(response.data.Code==100){
                        $scope.bookRecomList = response.data.Data;
                    }
                    //console.log( response.data.Data)
                })
            }
            else{
                var categoryId=$routeParams.categoryId||'';
                var keyword=$routeParams.keyword||'';
                var parameter={
                    categoryId:categoryId,
                    keyword:keyword
                }

                $scope.searchNull=false;
                bookListService.loadBookList(parameter).then(function(response){
                    $scope.bookRecomList=response.data.Data;
                    if(response.data.Data.length==0){
                        $scope.searchNull=true;
                    }
                })
            }

            $scope.goBack=function(){
                history.back();
            }
        })
        .controller('loginController',function($scope,userService,$location){
            $scope.loginState=false;
            //用户登录
            $scope.phone='';
            $scope.password='';
            $scope.login=function(){
               userService.request('librarywebapi/member/login',{
                   phone:$scope.phone,
                   password:$scope.password
               }).then(function(response){
                    console.log(response);
                    if(response.data.Code==100){
                        localStorage.setItem('userInfo',JSON.stringify(response.data.Data));
                        $location.url('/mine');
                        //?yourName='+JSON.parse(localStorage.getItem('userInfo'))
                    }else{
                        $scope.loginState=true;
                    }
                })

            }
        })
        .controller('searchController',function($scope,$location,sortService){
            $scope.keyword='';
            $scope.keywordArr=[];
            if(localStorage.getItem('keywordHistory')){
                $scope.keywordArr=JSON.parse(localStorage.getItem('keywordHistory'));
            }
            $scope.startSearch=function(){
                if($scope.keyword.length==0){
                    return;
                }

                //for(var i=$scope.keywordArr.length-1;i>0;i--){
                //    if($scope.keywordArr[i]!=$scope.keyword){
                //        //$scope.keywordArr.splice(i,1);
                //    }
                //}
                $scope.keywordArr.push($scope.keyword);

                for(var i=$scope.keywordArr.length-1;i>=0;i--){
                    var current=$scope.keywordArr[i];
                    var temp=$scope.keywordArr.slice(0,i);
                    var index=temp.indexOf(current);
                    if(index>=0){
                        $scope.keywordArr.splice(i,1);
                    }
                }

                localStorage.setItem('keywordHistory',JSON.stringify($scope.keywordArr));
                $location.url('/bookList?keyword='+ $scope.keyword);
            }
            $scope.clear=function(){
                localStorage.removeItem('keywordHistory');
                $scope.keywordArr=[];
            }
        })
        .controller('mineController',function($scope,$location,$window){
            //显示借书架数量
            $scope.shelfInfo=0;
            if(null!=$window.localStorage.getItem('shelfInfo')){
                $scope.shelfInfo=$window.localStorage.getItem('shelfInfo');
            }

            $scope.yourName='尚未登录';
            $scope.flag=false;
            if(localStorage.getItem('userInfo')){
                $scope.flag=true;
                $scope.yourName=JSON.parse(localStorage.getItem('userInfo')).Name;
                $scope.yourHeader=JSON.parse(localStorage.getItem('userInfo')).Header;
            }
            //进入借书架
            $scope.goPageShelf=function(){
                if(null!=$window.localStorage.getItem('userInfo')){
                    $location.url('/pageShelf');
                    return;
                }
                $location.url('/login');
            }
            //进入我的借阅
            $scope.goMyBorrow=function(){
                if(null!=$window.localStorage.getItem('userInfo')){
                    $location.url('/myBorrow');
                    return;
                }
                $location.url('/login');
            }
        })
        .controller('pageCodeController',function($scope,$window,userService,$location,shelfService,$interval){
            $scope.phone='';
            $scope.code='';
            $scope.codeIsShow=false;
            $scope.codeErrShow=false;
            $scope.codeConfirmShow=false;
            $scope.count=5;
            $scope.codeFlag=true;
            //获取验证码
            $scope.getCode=function(){
                if($scope.phone.length==0){
                    $scope.codeIsShow=true;
                    return;
                }
                $scope.codeFlag=false;
                userService.requestCode($scope.phone).then(function(response){
                    if(response.status==200&&response.data.Code==100){
                        var timer=$interval(function(){
                            $scope.count--;
                            if($scope.count==0){
                                $scope.count=5;
                                $scope.codeFlag=true;
                                $interval.cancel(timer);
                            }
                        },1000)
                    }else{
                        $scope.codeErrShow=true;
                    }
                })
            }
            //检查验证码
            $scope.stepNext=function(){
                userService.request('librarywebapi/member/VerifyCodeForReset',{
                    phone:$scope.phone,
                    code: $scope.code
                }).then(function(response){
                    console.log(response)
                    if(response.status==200&&response.data.Code==100){
                        $window.localStorage.setItem('userInfo',JSON.stringify(response.data.Data));
                        $location.url('/resetPassword');
                    }else{
                        $scope.codeConfirmShow=true;
                    }
                })
            }
        })
        .controller('resetPasswordController',function($scope,userService,$location){
            $scope.newPwd='';
            var id=JSON.parse(localStorage.getItem('userInfo')).Id;
            //重置密码
            $scope.submitPassword=function(){
                userService.request('librarywebapi/member/reset',{
                    id:id,
                    password:$scope.newPwd
                }).then(function(response){
                    console.log(response)
                    if(response.status==200&&response.data.Code==100){
                        $location.url('/login');
                    }
                })
            }
        })
        .controller('pageShelfController',function($scope,$location,$window,shelfService){
            $scope.goBack=function(){
                history.back();
            }

            $scope.myBooks=[];
            //先从本地读取书本信息
           // $scope.myBooks=JSON.parse($window.localStorage.getItem('bookInfo'));

            //return;

            //查看我的借书架
            var parameter={
                readerId:JSON.parse($window.localStorage.getItem('userInfo')).Id
            }
            $scope.allBook=0;
            shelfService.lookupShelfRequest(parameter).then(function(response){
                //console.log(response);
                if(response.status==200&&response.data.Code==100){
                   for(var i=0;i<response.data.Data.length;i++){
                       $scope.myBooks.push(response.data.Data[i]);
                       $scope.myBooks[i].correct=false;
                   }
                    $scope.allBook=response.data.Data.length;
                    $window.localStorage.setItem('shelfInfo', $scope.allBook);
                }
            })

            //选中状态
            $scope.changeRadio=function(item){
                var count=0;
                item.correct=!item.correct;
                for(var i=0;i<$scope.myBooks.length;i++){
                    if(!$scope.myBooks[i].correct){
                       count++;
                    }
                }
                if(count){
                    $scope.chkAll=false;
                }else{
                    $scope.chkAll=true;
                }
            }

            //全选与反选
            $scope.chkAll=false;
            $scope.changeChkAll=function(){
                //console.log($scope.myBooks)
                $scope.chkAll=!$scope.chkAll;
                for(var i=0;i<$scope.myBooks.length;i++){
                    $scope.myBooks[i].correct=$scope.chkAll;
                }
            }


            //移除我的借书架单项
            $scope.removeBookItem=function(item){
                //console.log(item)
                var paramItem={
                    readerId:parameter.readerId,
                    bookId:item
                }
                shelfService.removeBookItemRequest(paramItem).then(function(response){
                    console.log(response);
                    if(response.status==200&&response.data.Code==100){
                        shelfService.lookupShelfRequest(parameter).then(function(response){
                            //console.log(response);
                            if(response.status==200&&response.data.Code==100){
                                $scope.myBooks=response.data.Data;
                                $scope.allBook=response.data.Data.length;
                                $window.localStorage.setItem('shelfInfo', $scope.allBook);
                            }
                        })
                    }
                })
            }
            //移除我的借书架中所有图书
            $scope.removeAllBook=function(){
                $scope.nullState=false;
                if($scope.myBooks.length==0){
                    $scope.nullState=true;
                    return;
                }

                shelfService.removeBookAllRequest(parameter).then(function(response){
                    console.log(response);
                    if(response.status==200&&response.data.Code==100){
                        shelfService.lookupShelfRequest(parameter).then(function(response){
                            //console.log(response);
                            if(response.status==200&&response.data.Code==100){
                                $scope.myBooks=response.data.Data;
                                $scope.allBook=response.data.Data.length;
                                $window.localStorage.setItem('shelfInfo', $scope.allBook);
                            }
                        })
                    }
                })
            }
            //提交订单，实现借阅
            $scope.submitOrder=function(){
                if($scope.myBooks.length==0){
                    $scope.nullState=true;
                    return;
                }

                shelfService.submitOrderRequest('librarywebapi/Transaction/SubmitOrder',parameter)
                    .then(function(response){
                        console.log(response);
                        if(response.status==200&&response.data.Code==100){
                           //alert('提交订单成功！');
                        }
                    })
            }
        })
        .controller('myBorrowController',function($scope,shelfService,$window){
            var parameter={
                readerId:JSON.parse($window.localStorage.getItem('userInfo')).Id
            }

            $scope.borrowFlag=true;
            $scope.showCurrentBorrow=function(){
                $scope.borrowFlag=true;
            }
            $scope.showHistoryBorrow=function(){
                $scope.borrowFlag=false;
            }
            //查询读者所有借阅记录
            $scope.borrowRecords=[];
            $scope.borrowSuccessRecords=[];
            $scope.orderState=true;
            $scope.showState=function(state){
                switch (state){
                    case 0:return'已取消';
                    case 1:return'已提交';
                    case 2:return'已配送';
                    case 3:return'已确认';
                    case 4:return'已归还';
                }
            }
            shelfService.queryBorrowRequest(parameter).then(function(response){
                //console.log(response);
                if(response.status==200&&response.data.Code==100){
                    //$scope.borrowRecords=response.data.Data;

                    for(var i=0;i<response.data.Data.length;i++){
                        if(response.data.Data[i].State==4||response.data.Data[i].State==0){
                            $scope.borrowSuccessRecords.push(response.data.Data[i]);
                        }else{
                            $scope.borrowRecords.push(response.data.Data[i]);
                        }
                    }

                    //console.log( $scope.borrowSuccessRecords);
                }
            })
            //取消借阅
            $scope.cancelOrder=function(item){
                var param={
                    orderId:item.Id,
                    readerId:parameter.readerId
                }
                shelfService.submitOrderRequest('librarywebapi/Transaction/CancelOrder',param)
                    .then(function(response){
                        console.log(response);
                        if(response.status==200&&response.data.Code==100){
                            //borrowRecords.
                            //alert('取消订单成功！');
                            var index=-1;
                            for(var i=0;i< $scope.borrowRecords.length;i++){
                                if($scope.borrowRecords[i]==item){
                                    index=i;
                                }
                            }
                            $scope.borrowRecords.splice(index,1);
                            $scope.borrowSuccessRecords.push(item);
                        }else{
                            //alert('取消订单失败！');
                        }
                    })
            }
            //确认收货
            $scope.confirmOrder=function(item){
                var param={
                    orderId:item.Id,
                    readerId:parameter.readerId
                }
                shelfService.submitOrderRequest('librarywebapi/Transaction/ConfirmOrder',param)
                    .then(function(response){
                        console.log(response);
                        if(response.status==200&&response.data.Code==100){
                            //alert('确认收货成功！');
                            var index=-1;
                            for(var i=0;i< $scope.borrowRecords.length;i++){
                                if($scope.borrowRecords[i]==item){
                                    index=i;
                                }
                            }
                            $scope.borrowRecords.splice(index,1);
                        }else{
                            //alert('确认收货失败！');
                        }
                    })
            }
        })
        .controller('personalCenterController',function($scope,$location){
            //点击注销
            $scope.exit=function(){
                localStorage.removeItem('userInfo');
                $location.url('/mine');
            }
        })
})();