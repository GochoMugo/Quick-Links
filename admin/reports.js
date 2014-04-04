/*MAIN GLOBAL OBJECT*/
var QL_MASTER = {
    Admin: '', // Name of the Admin
    dataRef: '', // Data reference to FIREBASE
    alertBox: document.getElementById("alert_box"),
    btnSubmit: document.getElementById("submit"),
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
            var username = document.getElementById("username"),
                password = document.getElementById("password");
            
            // Ensuring no Empty textboxes
            switch ("") {
            case username.value:
                QL_MASTER.alert('warning', 'Ooh!', '<strong>Username</strong> is undefined');
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
            QL_MASTER.submit(username.value, password.value);
            // Resetting the form
            username.value = "";
            password.value = "";
            return;
        };
    },
    submit: function (username, password) {
        // Showing a Loading status
        QL_MASTER.btnSubmit.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Wait..";
        QL_MASTER.btnSubmit.className += " active";
        // Reading FB once to Check if it is the Admin
        QL_MASTER.dataRef.once('value', function (snapshot) {
            // Getting all the Admins
            var admins = snapshot.val().MASTER,
                admin,
                got_in = new Date(),
                submission;
            // Looping through all the Admins
            for (admin in admins) {
                /*CHECKING IF THE USERNAME AND PASSWORDS MATCH*/
                if (admin.username === username && admin.password === password) {
                    QL_MASTER.Admin = admin.username;
                    break;
                }
            }
            // Logging the Entry of the Admin
            submission = admins[admin].got_in = got_in;
            // Uploading the DATA to FIREBASE
            QL_MASTER.dataRef.update(submission, function (submitted) {
                if (submitted === null) {
                    // Getting Data
                } else {
                    QL_MASTER.alert('danger', '<i class="fa fa-warning"></i> <strong>Sorry!</strong>', 'You could <strong>NOT</strong> Get In');
                }
                QL_MASTER.btnSubmit.innerHTML = "Get In";
                QL_MASTER.btnSubmit.className = "btn btn-primary pull-right";
            });
            return;
        }, function (err) {
            // Error Occurred and Submission Number could not be retrieved
            QL_MASTER.alert('danger', '<i class="fa fa-warning"></i>', '<strong>ERROR</strong> occurred. We working to fix this.');
        });
    },
    init: function () {
        /*FIREBASE reference*/
        QL_MASTER.dataRef = new Firebase('https://quick-links.firebaseio.com/');
        /*Click functionality*/
        QL_MASTER.onClick();
    }
};

// If an error is caught by the engine, an alert box should appear
window.onerror = function (msg, url, line) {
    // Firebase is NOT defined 
    QL_MASTER.alert('danger', '<i class="fa fa-cogs fa-lg"></i>', "Impossible to Log In at the moment. Try <strong>reloading</strong> this page.");
    QL_MASTER.btnSubmit.innerHTML = "CAN NOT LOG IN AT ALL";
    QL_MASTER.btnSubmit.className += " disabled";
};

/*Document is READY and ALL JS Parsed by engine*/
$(document).ready(function () {
    QL_MASTER.init(); /*Initialization*/
});
