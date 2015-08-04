;(function( $ ){
/**********************************************Значения по умолчанию*******************************/
    var defaults = {
      'range_label': 'Выберете сложность',
      'dissect_button_label' : 'Разрезать картинку',
      'join_button_label' : 'Собрать картинку',
    };
/*********************************Функция конструктор*******************************************/
    function CreatePuzzle(element,options){
        this.config = $.extend({}, defaults, options);
        this.element=element;
        this.launchAll();
    }
/**************************************Добавление разметки паззла и установка начальных параметров для элементов разметки**********/    
    CreatePuzzle.prototype.addPuzzle=function(){
        this.element.html("<div class='puzzle-wrapper'><input type='file' class='puzzle-dialog' accept='image/x-png, image/gif, image/jpeg'><div class='puzzle-header'><h3>"+this.config.range_label+"</h3><input class='puzzle-range' type='range' name='quantity' min='4' max='10'></div><div class='puzzle-bg'></div><p><button id='dissect' >"+this.config.dissect_button_label+"</button><button id='join'>"+this.config.join_button_label+"</button></p></div>");
        this.range = $('.puzzle-range');
        this.puzzle = $('.puzzle');
        this.puzzle_header=$('.puzzle-header');
        this.puzzle_bg=$('.puzzle-bg');
        this.puzzle_header.css('display', 'none');
        this.range.val(0);
        this.segmentsCoords =[];
        this.dissect_button=$('#dissect');
        this.dissect_button.hide();
        this.join_button=$('#join');
        this.join_button.hide();
    }
/***************************Запуск основных функций*****************/
    CreatePuzzle.prototype.launchAll=function(){
        this.addPuzzle();
        this.chooseImage(this);
        this.dissectButtonClick();
        this.joinButtonClick();

        
    }
    /*****************************Выбор картинки для паззла*******************************/
    CreatePuzzle.prototype.chooseImage = function(context){
        var _URL = window.URL || window.webkitURL;
           $('.puzzle-dialog').change(function(e) {
              var reader = new FileReader(), 
                  file = this.files[0],
                  self=context;
          reader.onloadend = function() {
                img = new Image();
                img.onload = function() {
                    self.puzzle_bg.css({'width':this.width,'height':this.height}).prev().children('input').css('width',this.width);
                };
                img.src = _URL.createObjectURL(file);
                self.puzzle_bg.css({'background':'url(' + this.result + ')'});
                self.img_bg=this.result;
                self.puzzle_header.show();
                self.dissect_button.show();
          }
          file ? reader.readAsDataURL(file) : self.puzzle_bg.css('background', 'none');
        
        });
    }
    /*****************************Перетаскивание кусков паззла*******************************/
   CreatePuzzle.prototype.drag=function(){
        var self=this;
         
        this.segmentDomElement.draggable({
            cursor:'move',
            stack:'.segment',
            containment:'.puzzle-wrapper',
            //grid:[this.segment.size.segment_width,this.segment.size.segment_height],
            snap: true,
            snapMode: "inner",
              drag: function(e,ui) {
                //self.segmentDomElement.prev().offset({left:ui.position.left,top:ui.position.top });
                //self.segmentDomElement[2].position.top=ui.position.top;
                //console.log(self.segmentDomElement[2]);
             },
              stop: function(e,ui) {
               var index=self.segmentDomElement.index(this);
                self.addSegmentCoords(ui.position.left,ui.position.top,index,true,false,self.segmentsCoords[index]);
                //console.log(index);
                //console.log(self.segmentsCoords[index]);  
                var i=0,j=0,this_obj=self.segmentsCoords[index];
                //console.log(this_obj);
                   for (i;i<self.segmentsCoords.length;i++){
                                 //console.log(self.segmentsCoords[j].def_coords['right_bottom_def_coord_y']+'/'+segmentsCoords[indx].def_coords['left_bottom_def_coord_y']);
                        if (i===index){
                            continue;
                        }
                            else {
    
                                    if (
(Math.floor(this_obj.new_coords['left_top_new_coord_x'])=== Math.floor(self.segmentsCoords[i].new_coords['right_top_new_coord_x']))&&(Math.floor(this_obj.new_coords['right_top_new_coord_y'])=== Math.floor(self.segmentsCoords[i].new_coords['right_top_new_coord_y']))&&(Math.floor(this_obj.def_coords['left_top_def_coord_x'])=== Math.floor(self.segmentsCoords[i].def_coords['right_top_def_coord_x']))&&(Math.floor(this_obj.def_coords['left_top_def_coord_y'])===Math.floor(self.segmentsCoords[i].def_coords['right_top_def_coord_y']))
            )
                                //seg.appendTo('.blob').draggable('disable');
                                { console.log($(this).width());
                                   // $(this).css({"width":$(this).width()+self.segmentDomElement.eq(i).width(),'background-position-x':"-" +self.segmentDomElement.eq(i).width()+"px"})
                                    self.segmentDomElement.eq(i).remove();
                                    self.segmentsCoords[i].remove();
                                }


                            
                            
                       
                }
        }

    }
   });
}
    
   /******************************Рассчитать размеры паззла и размеры куска паззла********************************/
   CreatePuzzle.prototype.dissect=function(){
         CreatePuzzle.prototype.PUZZLE_WIDTH=this.puzzle_bg.width();
         CreatePuzzle.prototype.PUZZLE_HEIGHT=this.puzzle_bg.height();
         this.segment={size:{segment_width:this.puzzle_bg.width()/this.range.val(),segment_height:this.puzzle_bg.height()/this.range.val()}}
   }

  /********************************************Создать части паззла*************************/
  CreatePuzzle.prototype.addPuzzleParts=function(){
    var backgroundSize= this.segment.size.segment_width+ 'px ' + this.segment.size.segment_height + 'px';
    var segment_width=this.segment.size.segment_width+'px',
        segment_height=this.segment.size.segment_height+'px';
        var self=this;
   $.each(Array(this.range.val()*this.range.val()), function(indx,slf) {
    /********************************Добавить div.segment c соотв. css*******************/
        var cntxt=$(slf);
            var div = $("<div></div>", {
                "class": "segment",
                "css": {
                    "width": segment_width,
                    "height": segment_height,
                    "outline": "1px solid black",
                    "backgroundSize" : backgroundSize,
                    "background":'url(' + self.img_bg + ')'
                }
            }
            ).appendTo(self.puzzle_bg); 
        });
        this.segmentDomElement=$('.segment');
        this.drag();
    } 
 /********************************добавить к блокам segment фоновое изоражение*******************/

 CreatePuzzle.prototype.addBackgroundToSegments = function(p){
    var bg_segment_pos_x,bg_segment_pos_y;
        this.segmentDomElement.each(function(indx,slf){
            var context=$(slf);
            bg_segment_pos_x=context.position().left;
            bg_segment_pos_y=context.position().top;
                context.css({
                    "left": bg_segment_pos_x,
                    "top":  bg_segment_pos_y,
                    "background-position-x":"-" +bg_segment_pos_x+"px",
                    "background-position-y":"-"+bg_segment_pos_y+"px",
                });
                p.segmentsCoords.push(p.addSegmentCoords(bg_segment_pos_x,bg_segment_pos_y,indx,true,true,p.segmentsCoords[indx]));
                //console.log(p.segmentsCoords);
        }).css("position","absolute");

 }
 /*************************************Записать координаты каждого из сегментов************************/
 
 CreatePuzzle.prototype.addSegmentCoords=function(new_x,new_y,index,allow_new_coords,allow_def_coords,obj) {

           var buf_obj={};

            if(allow_new_coords===true){
                
                buf_obj.new_coords={
                    "left_top_new_coord_x":new_x,
                    "left_top_new_coord_y":new_y,

                    "right_top_new_coord_x":new_x+this.segment.size.segment_width,
                    "right_top_new_coord_y":new_y,

                    "left_bottom_new_coord_x": new_x,
                    "left_bottom_new_coord_y": new_y+this.segment.size.segment_height,

                    "right_bottom_new_coord_x": new_x+this.segment.size.segment_width,
                    "right_bottom_new_coord_y": new_y+this.segment.size.segment_height
                }
            };
            if(allow_def_coords===true){
                buf_obj.def_coords={
                    "left_top_def_coord_x": new_x,
                    "left_top_def_coord_y": new_y,

                    "right_top_def_coord_x": new_x+this.segment.size.segment_width,
                    "right_top_def_coord_y": new_y,

                    "left_bottom_def_coord_x":  new_x,
                    "left_bottom_def_coord_y":  new_y+this.segment.size.segment_height,

                    "right_bottom_def_coord_x":  new_x+this.segment.size.segment_width,
                    "right_bottom_def_coord_y":  new_y+this.segment.size.segment_height
                }
            }
            
                  if(typeof obj!=='undefined') {
                    $.extend(obj, buf_obj);
                    //console.log(obj);
                    return obj
                }
                else{
                   //console.log(buf_obj);
                   return buf_obj;} 
                   //console.log(buf_obj);
                  // return buf_obj
                       
            };
 
  /**************************Вспомогательная функция генерации случайных чисел***************/
   CreatePuzzle.prototype.random = function(min,max,l){
        var arr = [],m = [],n = 0;
          if (max - min < l-1) return;
          for (var i=0; i<=(max-min); i++)m[i] = i + min;
          for (var i=0; i<l; i++) {n = Math.floor(Math.random()*(m.length)); arr[i]=m.splice(n,1)[0];};
          return arr
    }  
/**************************Перемешать куски паззла*******************************************/
 CreatePuzzle.prototype.shakeSegments = function(p){
    var arr_of_shaked_indexes = this.random(0,this.segmentsCoords.length-1,this.segmentsCoords.length);
    this.segmentDomElement.each(function(indx,self){
        var self=$(self);
        self.css({'left':p.segmentsCoords[arr_of_shaked_indexes[indx]].def_coords["left_top_def_coord_x"],top: p.segmentsCoords[arr_of_shaked_indexes[indx]].def_coords["left_top_def_coord_y"]});          
        });
 }
  /******************************Онклик для кнопки разрезать********************************/ 
  CreatePuzzle.prototype.dissectButtonClick = function(){
    var self = this;
       this.dissect_button.on("click", function() {
        self.join_button.show();
      //  console.log(this);
            $(this).hide();
            self.dissect();
            self.range.attr('disabled','disabled');
            self.puzzle_bg.css('background','none')
            self.addPuzzleParts(this);
            self.addBackgroundToSegments(self); 
            self.shakeSegments(self);  
       });
    }
  /******************************Онклик для кнопки собрать********************************/ 
  CreatePuzzle.prototype.joinButtonClick = function(){
    var self = this;
      this.join_button.on("click", function() {
            $(this).hide();
            self.segmentDomElement.each(function(indx, that) {
                var that = $(that);
                that.animate({
                    left: self.segmentsCoords[indx]["def_coords"]["left_top_def_coord_x"],
                    top:  self.segmentsCoords[indx]["def_coords"]["left_top_def_coord_y"]
                }, 2000, function() {
                   that.remove();
                       // $('.mediator_vert').remove();
                        // $('.mediator_hor').remove();
                        // $('.seq li').remove();
                    self.dissect_button.show();
                    self.range.removeAttr('disabled');
                    self.puzzle_bg.css('background','url(' + self.img_bg + ')')
                    self.segmentsCoords=[];
                })
            }) 
        });
    }  
/**************************Добавление метода в объект jQuery********************************/
  $.fn.CreatePuzzle = function(options){
     new CreatePuzzle(this, options);
    return this;
  };

  
})( jQuery );


