/*MAIN GLOBAL OBJECT*/
var QL_MASTER = {
    dataRef: '',    // Data reference to FIREBASE //
    auth: '',       // Simple Login
    alertBox: document.getElementById("alert_box"),
    btnSubmit: document.getElementById("submit"),
    enableBtn: function (message) {
        QL_MASTER.btnSubmit.innerHTML = message;
        QL_MASTER.btnSubmit.className = "btn btn-primary pull-right";
    },
    disableBtn: function (message) {
        QL_MASTER.btnSubmit.innerHTML = message;
        QL_MASTER.btnSubmit.className = "btn btn-primary pull-right disabled";
    },
    //btnReset: document.getElementById("reset"),
    alert: function (status, word, message) {
        var result;
        // DIV Structure of the Message
        result = "<div class='alert alert-#STATUS alert-dismissable'>";
        result += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        result += "<strong>#WORD</strong> #MESSAGE";
        result += "</div>";
        // Assigning the CUSTOM values in the Message
        result = result.replace('#STATUS', status).replace('#WORD', word).replace('#MESSAGE', message);
        QL_MASTER.alertBox.innerHTML = result;
        return;
    },
    onClick: function () {
        QL_MASTER.btnSubmit.onclick = function () {
            // Variables holding the form elements
            var email = document.getElementById("email"),
                password = document.getElementById("password"),
                rememberMe = document.getElementById("rememberMe");
            
            // Ensuring no Empty textboxes
            switch ("") {
            case email.value:
                QL_MASTER.alert('warning', 'Ooh!', '<strong>Email</strong> is undefined');
                username.focus();
                return;
            case password.value:
                QL_MASTER.alert('warning', 'Oops!', 'Where\'s the <strong>Password</strong>?');
                password.focus();
                return;
            }
            // Resetting defaults
            QL_MASTER.alertBox.innerHTML = "";

            // Submitting the Data
            QL_MASTER.login(email.value, password.value, rememberMe.value);
            // Resetting the form
            email.value = "";
            password.value = "";
            return;
        };
    },
    login: function (email, password, rememberMe) {
        // Showing a Loading status
        QL_MASTER.disableBtn("<i class='fa fa-spinner fa-spin'></i> Logging in..");
        // Authenticating
        QL_MASTER.auth.login('password', {
            email: email,
            password: password,
            rememberMe: rememberMe
        });
    },
    resetPassword: function (email) {
        QL_MASTER.auth.sendPasswordResetEmail(email, function (error, success) {
            // Sucess
            if (!error) {
                QL_MASTER.alert("success", "<i class='fa fa-check'>", "Password reset email sent successfully");
            }
        });
    },
    getData: function (read) {
        // Detaching any callbacks
        QL_MASTER.dataRef.off();
        // Listening for Data changes from DB
        QL_MASTER.dataRef.child("messages").on('value', function (snapshot) {
            var messages = snapshot.val(),
                message;  // Data returned: messages
            // Looping thru' the JSON object
            for (message in messages) {
                if (read === true) {
                    // For ALL messages
                    QL_MASTER.showData(message.status, message.username, message.email, message.details);
                } else if (read === false && message.seen === "false") {
                    // For Only unread messages
                    QL_MASTER.showData(message.status, message.username, message.email, message.details);
                }
            }
        });
    },
    showData: function (status, username, email, details, resolved, date) {
        // DOM objects for inserting the Messages
        var bugBox = document.getElementById('bugs'),
            changeBox = document.getElementById('changes'),
            thankBox = document.getElementById('thanks'),
            proto,
            newMsg;
        // Structure of all messages
        // CLS --> bugs, changes, issues(thanks)
        // RESOLUTION --> resolved, unresolved
        proto = "<div class='single-#CLS'>";
        proto += "<span class='status-#RESOLUTION'>#STATUS</span>";
        proto += "<p>#DETAILS</p>";
        proto += "<span class='date'>#DATE</small>";
        proto += "</div>";
        
        // Customizing
        newMsg = proto.replace('#CLS', status).replace('#RESOLUTION', resolved).replace('#STATUS', resolved).replace('#DETAILS', details).replace('#DATE', date);
        // SWITCHing to get the correct container
        switch (status) {
        case 'bugs':
            bugBox.innerHTML += newMsg;
            break;
        case 'changes':
            changeBox.innerHTML += newMsg;
            break;
        case 'thanks':
            thankBox.innerHTML += newMsg;
            break;
        }
    },
    init: function () {
        /*FIREBASE reference*/
        QL_MASTER.dataRef = new Firebase('https://quick-links.firebaseio.com/');
        QL_MASTER.auth = FirebaseSimpleLogin(QL_MASTER.dataRef, function (error, user) {
            /*Success*/
            if (!error) {
                QL_MASTER.enableBtn("Get In");
                // QL_MASTER.btnReset.className -= " active"; //
                /*Click functionality*/
                QL_MASTER.onClick();
            } else {
                QL_MASTER.alert("danger", "<i class='fa fa-cogs fa-lg'></i>", "Firebase login connection failed");
                QL_MASTER.disableBtn("Can NOT connect to Firebase");
            }
        });
    }
};

// If an error is caught by the engine, an alert box should appear
window.onerror = function (msg, url, line) {
    // Firebase is NOT defined 
    QL_MASTER.alert('danger', '<i class="fa fa-cogs fa-lg"></i>', "Impossible to Log In at the moment. Try <strong>reloading</strong> this page.");
    QL_MASTER.disableBtn("Impossible to Log In");
};

/*Document is READY and ALL JS Parsed by engine*/
$(document).ready(function () {
    QL_MASTER.init(); /*Initialization*/
});
