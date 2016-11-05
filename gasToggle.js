"use strict";
let navWidth, isToggled = false;

const LEVEL_ERROR = "warning";
const LEVEL_WARN = "info";
const LEVEL_INFO = "promo";
const observer = new MutationObserver((e) => {
  observer.disconnect();
  $('.github-alert').remove();  
});

$(() => {  
  initPageContent() 
  .then(initPageEvent)
  .catch((err) => {
    switch (err.message) {
      case "nothing" :
        break;
      default:
        showAlert("Unknow Error", LEVEL_ERROR);
        break;
    }
  });
});



function initPageContent() {
  return Promise.all([
    $.get(chrome.runtime.getURL('content/toggleBar.html'))
   
  ])
  .then((content) => {
    $('#undoButton').before(content[0]);
  })
  .then(() => {
    chrome.runtime.sendMessage({ cmd: "tab" });
  });
}
function initPageEvent() {
 ['sidebarToggle'].forEach((type) => {
    $(document).on('mouseover', `#${type}Button`, () => {
      $(`#${type}Button`).addClass('goog-toolbar-button-hover');
    });

   
    $(document).on('mouseleave', `#${type}Button`, () => {
      $(`#${type}Button`).removeClass('goog-toolbar-button-hover');
    });
    
    $(document).on('click', `#${type}Button`, () => {



     var resourceListPanel = $('.resource-list').parent();
     var dragHandle = $('.gwt-SplitLayoutPanel-HDragger').parent();
     var  editorPanel = $('.gwt-TabLayoutPanel').parent();
     isToggled = !isToggled;

     $( window ).unload(function() {
       navWidth = "250px";
       resourceListPanel.css('width',navWidth)
       dragHandle.css('left',navWidth);
       editorPanel.css('left',  parseInt(dragHandle.css('left')) +9 );
      });

      if(isToggled){
       $(`#${type}Button`).addClass('goog-toolbar-button-active');          
       navWidth =  resourceListPanel.css('width'); 

       resourceListPanel.css('width','2px')
       dragHandle.css('left','2px');
       editorPanel.css('left','2px');      
       
       resourceListPanel.on('mouseenter',function(){
           resourceListPanel.css('width',navWidth)
           dragHandle.css('left',navWidth);
           editorPanel.css('left',  parseInt(dragHandle.css('left')) +9 );
       });
       
       resourceListPanel.on('mouseleave',function(){
       resourceListPanel.css('width','2px')
       dragHandle.css('left','2px');
       editorPanel.css('left','2px');
       });
      }else{
      $(`#${type}Button`).removeClass('goog-toolbar-button-active');
       resourceListPanel.css('width',navWidth)
       dragHandle.css('left',navWidth);
       editorPanel.css('left',  parseInt(dragHandle.css('left')) +9 );
      
      resourceListPanel.off('mouseenter');
      resourceListPanel.off('mouseleave');
      }
      
    });
  });

  $(document).on('click', '.github-alert-dismiss', () => {
    $('.github-alert').remove();
  });
}

/* show alert using gas ui
 * level: info, warning, error
 * but the class is promo. info, warning
 */
function showAlert(message, level=LEVEL_INFO) {
  $.get(chrome.runtime.getURL('content/alert.html'))
  .then((content) => {
    observer.disconnect();
    $('#docs-butterbar-container').empty().append(content.replace(/_LEVEL_/g, level).replace(/_MESSAGE_/, message));
    observer.observe(document.getElementById('docs-butterbar-container'), { childList: true });
  })
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}