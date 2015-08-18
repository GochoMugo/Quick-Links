/*HANDLES SETTINGS ON THE PANEL*/
var QL_add = {
  links: [],
  collection: undefined, 
  generateHTML: function (table_id, id, icon_class, active, display_name,
    url, keyword) {
    "use strict";
    /*
    * Prototype of the DOM structure to be achieved
    * <tr>
    *   <td>
    *     <input type='checkbox' id='$id_of_link'/>
    *     <label for='$id_of_link'></label>   
    *   </td>
    *  <td><i class='fa $icon'></i>$keyword</td>
    *  <td>$translated_display_name</td>
    *   <td><i class='fa fa-times'></i></td>
    * </tr>
    */
    var create = function (el) { document.createElement(el); } // Short-form
    /*Creating new elements*/
    var row = create("tr");
    var cell1 = create("td");
    var checkbox = create("input");
    var label = create("label");
    var cell2 = create("td");
    var icon = create("i");
    var cell3 = create("td");
     /*Customizing the new elements*/
     checkbox.className = 'chkbx';
     checkbox.setAttribute("type", "checkbox");
     checkbox.id = id;
     checkbox.checked = active;
     label.setAttribute("for", id);
     icon.className = "fa " + icon_class;
     $(icon).attr("id", id + 'icon');
     icon.href = url;
     /*Organising the structure*/
     $(cell1).append(checkbox, label);
     $(cell2).append(icon);
     if (keyword) $(cell2).append(keyword); // Inserts a keyword
     $(cell3).append(display_name);
     $(row).append(cell1, cell2, cell3);
     /*If the link is NOT preset, it's a custom one'*/
     if (keyword) {
      var cell4 = create("td"), closeIcon = create("i") ;
      closeIcon.className = "fa fa-times";
      $(cell4).append(closeIcon);
      $(row).append(cell4); 
     }
     /*Inserting into DOM*/
     $("#" + table_id).append(row);
     QL_add.open(id + 'icon');
  },
  postback: function () {
    "use strict";
    /*
    * Checks whether the links have been updated
    * Handles getting the check state of all the checkboxes and adding to
    * the property of each link. Then sends back the links
    */
    QL_add.links.forEach(function (link) {
      link.active = document.getElementById(link.id).checked;
    });
    self.postMessage({"aim": "links", "content": QL_add.links});
  },
  receivelinks: function (links) {
    "use strict";
    /*
    * This will receive the links and place them in the links property of
    * QL_add
    * It will also initiate the HTML manipulation
    */
    $('#add-table tbody').empty();
    $("#major-sites tbody").empty();
    QL_add.links =  links;
    links.forEach(function (link) {
      if (link.keyword) {
        QL_add.generateHTML("add-table" , link.id, link.icon, link.active, 
                          link.display_name, link.url, link.keyword, "custom");
      } else {
        QL_add.generateHTML( "major-sites", link.id, link.icon, link.active, 
                          link.display_name, link.url);
      }
    });
    QL_add.removeLink();
  },
  alert: function (type, event) {
    "use strict";
    /* 
    * Translation is required. Thus a new message object is created and 
    * posted and receive translated messages from locale files
    * Message is sent after the handler has been registered
    */
    var msg = {
      aim: 'translate',
      content: event
    };
    
    // Receiving message from translation
    self.on('message', function (message) {
      if (message.aim === 'translated') {
        var create = function (el) document.createElement(el), 
             alertBox = create("div"),
             close_btn = create("button");
        // Styling the new elements
        alertBox.className = "alert alert-" + type + " alert-dismissable";
        close_btn.className = "close";
        close_btn.setAttribute("data-dismiss", "alert");
        close_btn.setAttribute("aria-hidden", "true");
        // Organising the elements
        $(close_btn).append("&times;");
        $(alertBox).append(close_btn);
        $(alertBox).append(message.content);
        // Inserting into DOM
        $("#add-alert").empty().append(alertBox);
      }
    });
    
    // Handling different errors
    switch (event) {
    case "alert_BlankTitle":
    case "alert_ExistingTitle":
      document.getElementById('add-title')
        .parentNode.className += ' has-warning';
      document.getElementById('add-title').focus();
      break;
    case "alert_BlankUrl":
       document.getElementById('add-url')
        .parentNode.className += ' has-warning';
      document.getElementById('add-url').focus();
      break;
    case "alert_BlankIdentifier":
    case "alert_MaxIdLength":
       document.getElementById('add-id')
        .parentNode.className += ' has-warning';
      document.getElementById('add-id').focus();
      break;
    }
    self.postMessage(msg);
    return;  
  },
  reset: function (priority) {
    "use strict";
    /*
    * Clears the Alert box, and states on input boxes
    */
    var input_boxes = [
      document.getElementById('add-title'),
      document.getElementById('add-url'),
      document.getElementById('add-id')
    ];
    input_boxes.forEach(function (box) {
      box.parentNode.className = 'input-group';
      if (priority === "hard") {box.value = '';}
    });
    if (priority === "hard") {
      $("#add-alert").empty();
    }
  },
  newLink: function (id, icon, name, url, active, keyword) {
    "use strict";
    /*
    * Creates a new link: creates the object and invokes html generation and 
    * insertion into dom. Ensures that the title is unique.
    */
    var proceed = true;
    QL_add.links.forEach(function (link) {
      if (link.id === id) {
        QL_add.alert('danger', 'alert_ExistingTitle');
        proceed = false;
        return;
      }
    });
    if(!proceed) return;
    var link = {
      "id": id,
      "icon" : icon,
      "display_name" : name,
      "url" : url,
      "active": active,
      "keyword": keyword
    };
    QL_add.links.push(link);
    QL_add.generateHTML("add-table" , link.id, link.icon, link.active, 
                          link.display_name, link.url, link.keyword, "custom");
    QL_add.removeLink();
  },
  removeLink: function () {
    "use strict";
    /*
    * Removes links from the table and in the links array
    * Gets All the close icons and applys the functionality to them
    */
    QL_add.collection = document.getElementsByClassName('fa-times');
    // Looping thru' the Icons
    for (var i = 0; i < QL_add.collection.length; i++) {
      // Adding the Click functionality
      QL_add.collection[i].onclick = function () {
        var currentRow = this.parentNode.parentNode; // the Row
        var table = currentRow.parentNode.parentNode; // the Table
        var title = currentRow.childNodes[2].innerHTML; // the Title
        $(currentRow).remove(); // Using jQuery to remove the Row

        var newArray = [];
        QL_add.links.forEach(function (link) {
          if (link.id !== title) {
            newArray.push(link);
          }
        });
        
        QL_add.links = newArray;
      }
    }
    return;
  },
  addBtn: function () {
    "use strict";
    /*
    * Resetting the Input boxes and alert boxes
    * Adds functionality of adding new links
    * Will make sure the form is completed and the HTML generated
    * 1. Loops to get the icon selected. If not, alert user and stop.
    * 
    */
    
    document.getElementById('add-btn').onclick = function () {
      QL_add.reset();
      
      var title = document.getElementById('add-title').value,
           url = document.getElementById('add-url').value,
           id = document.getElementById('add-id').value, // Identifier
           radios = document.getElementsByClassName('radios'), 
           icon;

      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {icon = radios[i].id;}
      }
         
      if (!icon) { 
        // No icon has been chosen
        QL_add.alert('warning', 'alert_NoIconChecked');
        return;
      }
      
      if (title === '') {QL_add.alert('warning', 'alert_BlankTitle'); return;}
      if (url === '') {QL_add.alert('warning', 'alert_BlankUrl'); return;}
      if (id === '') {QL_add.alert('warning', 'alert_BlankIdentifier'); return;}
      if (id.length > 2) {QL_add.alert('danger', 'alert_MaxIdLength'); return;}
      QL_add.newLink(title, icon, title, url, true, id);
      
      QL_add.reset("hard");
      return;
    }
  },
  bookmark: function (title, url) {
    "use strict";
    /*
    * Activates the second tab
    * Fills the Title and URL textboxes with the params passed
    */
    $('#ctrl-tabs #tab_2').tab('show');
    document.getElementById('add-title').value = title;
    document.getElementById('add-url').value = url;
  },
  closeBtn: function () {
    "use strict";
    /*Adds the Add functionality to the 'add' button*/
    document.getElementById('close-button').onclick = function () {
      self.postMessage({"aim": "close"});
    };
  },
  open: function (id) {
    "use strict";
    /*Adds the functionality of Opening tabs from the add panel
    * when an icon is clicked */
    $('#' + id).click(function () {
      var msg = {
        "aim": "linkOpen",
        "content": this.href
      };
      self.postMessage(msg);
    });
  },
  init: function () {
    "use strict";
    /*
    * INITIALIZER
    * Message handling:
    * Message must have ''aim'' and "content'' properties 
    *   "close": send back the links to know which has been set to active
    *   objects: receive links placed in an array
    * Also adds functionality of the add and close buttons
    */
    self.on('message', function (message) {
      switch (message.aim) {
      case "close":
        QL_add.postback();
        break;
      case "links":
        QL_add.receivelinks(message.content);
        break;
      case "bookmark":
        QL_add.bookmark(message.content.title, message.content.url);
        break;
      case "overquota":
        QL_add.overquota();
        break;
      }
    });
    QL_add.addBtn();
    QL_add.closeBtn();
  }
};


/*Initializing*/
QL_add.init(); 
