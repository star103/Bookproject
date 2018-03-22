/**
 * Created by Administrator on 2018/1/8.
 */
(function(){
    angular.module('app.services',[])
        .constant('ROOT_URL','http://192.168.12.100/')
        //.config(function($locatio))
        .service('homeService',function($http,ROOT_URL){
            //获取轮播广告
            this.getSlider=function(){
                return $http.get(ROOT_URL+'librarywebapi/advert/list');
            }
            //获取推荐图书
            this.getRecomBook=function(){
                return $http.get(ROOT_URL+'librarywebapi/section/list');
            }
            //获取馆长推荐Id
            this.getRecomId=function(recomId){
                return $http.get(ROOT_URL+'librarywebapi/book/GetBooksBySection',{params:{sectionId:recomId}});
            }
        })
        .service('sortService',function($http,ROOT_URL){
            //获取分类列表
            this.getBookSort=function(){
                return $http.get(ROOT_URL+'librarywebapi/category/list');
            }
            //根据类别Id加载图书列表
            this.getBookSortId=function(sectionId){
                return $http.get(ROOT_URL+'librarywebapi/book/list',{params:{categoryId:sectionId}});
            }
            //根据关键字加载图书列表
            this.getBookByKeyword=function(key){
                return $http.get(ROOT_URL+'librarywebapi/book/list',{params:{keyword:key}});
            }
        })
        .service('detailService',function($http,ROOT_URL){
            //获取图书详情
            this.getBookDetail=function(bookId){
                return $http.get(ROOT_URL+'librarywebapi/book/single',{params:{id:bookId}});
            }
        })

        .service('bookListService',function($http,ROOT_URL){
            //根据categoryId/keyword加载图书列表
            this.loadBookList=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/book/list',{params:parameter});
            }
        })
        .service('userService',function($http,ROOT_URL){
            //用户登录
            this.request=function(url,data){
                return $http({
                    method:'post',
                    url:ROOT_URL+url,
                    params:data
                });
            }
            //获取验证码
            this.requestCode=function(phone){
                return $http.get(ROOT_URL+'librarywebapi/member/SendCodeForReset',{params:{phone:phone}});
            }
        })
        .service('shelfService',function($http,ROOT_URL){
            //加入借书架
            this.addShelfRequest=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/Transaction/AddBookShelf',{params:parameter});
            }
            //查看我的借书架
            this.lookupShelfRequest=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/Transaction/GetMyShelf',{params:parameter});
            }
            //移除我的借书架单项
            this.removeBookItemRequest=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/Transaction/RemoveBookFromShelf',{params:parameter});
            }
            //移除我的借书架中所有图书
            this.removeBookAllRequest=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/Transaction/RemoveMyShelf',{params:parameter});
            }
            //提交订单，实现借阅  //取消借阅
            this.submitOrderRequest=function(url,data){
                return $http({
                    method:'post',
                    url:ROOT_URL+url,
                    params:data
                });
            }
            //查询读者所有借阅记录
            this.queryBorrowRequest=function(parameter){
                return $http.get(ROOT_URL+'librarywebapi/Transaction/GetBorrowRecords',{params:parameter});
            }
        })
})()