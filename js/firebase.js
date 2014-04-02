/*MAIN GLOBAL OBJECT*/
var QL_webweaver = {
    dataRef: '', // Data reference to FIREBASE
    alertBox: document.getElementById("frm_alert"),
    btnSubmit: document.getElementById("frm_submit"),
    alert: function (status, word, message) {
        var result;
        // DIV Structure of the Message
        result = "<div class='alert alert-#STATUS alert-dismissable'>";
        result += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
        result += "<strong>#WORD</strong> #MESSAGE";
        result += "</div>";
        // Assigning the CUSTOM values in the Message
        result = result.replace('#STATUS', status).replace('#WORD', word).replace('#MESSAGE', message);
        QL_webweaver.alertBox.innerHTML = result;
        return;
    },
    onClick: function () {
        QL_webweaver.btnSubmit.onclick = function () {
            // Variables holding the form elements
            var txtUsername = document.getElementById("frm_username"),
                txtEmail = document.getElementById("frm_email"),
                txtDetails = document.getElementById("frm_details"),
                radios = document.getElementsByClassName("radios"),
                i,
                j = false,
                status;
            
            // Ensuring no Empty textboxes
            switch ("") {
            case txtUsername.value:
                QL_webweaver.alert('warning', 'Ooh!', '<strong>Username</strong> is undefined');
                txtUsername.focus();
                return;
            case txtEmail.value:
                QL_webweaver.alert('warning', 'Oops!', 'You have <strong>NO email</strong>?');
                txtEmail.focus();
                return;
            case txtDetails.value:
                QL_webweaver.alert('warning', 'Snap!', 'Please provide some <strong>details</strong>!');
                txtDetails.focus();
                return;
            }
            // Ensuring an option is checked
            for (i = 0; i < radios.length; i++) {
                if (radios[i].checked === true) {
                    j = true;
                    status = radios[i].id;
                }
            }
            if (j === false) {
                QL_webweaver.alert('warning', 'Pop!', 'Is it a <strong>Bug</strong>, <strong>Change</strong> or <strong>Thumbs up</strong>?');
                return;
            }
            // Resetting defaults
            j = false;
            QL_webweaver.alertBox.innerHTML = "";

            // Submitting the Data
            QL_webweaver.submit(status, txtUsername.value, txtEmail.value, txtDetails.value);
            // Resetting the form
            txtUsername.value = "";
            txtEmail.value = "";
            txtDetails.value = "";
            for (i = 0; i < radios.length; i++) {
                radios[i].checked = false;
            }
            return;
        };
    },
    submit: function (status, username, email, details) {
        // Showing a Loading status
        QL_webweaver.btnSubmit.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Sending..";
        QL_webweaver.btnSubmit.className += " active";
        // Reading FB once to get the Submission number
        QL_webweaver.dataRef.once('value', function (snapshot) {
           // The submission number
            var no = parseFloat(snapshot.val().submissions) + 1,
                submission = {status: null}; // Creating a JSON object for FIREBASE
            // Submission is classified as either 'bugs', 'changes' or 'thanks'
            submission[status][no] = {
                //"timestamp": QL_webweaver.dataRef.ServerValue.TIMESTAMP,
                "status": status,
                "username": username,
                "email": email,
                "details": details
            };
            // Uploading the DATA to FIREBASE
            QL_webweaver.dataRef.update(submission, function (submitted) {
                if (submitted === null) {
                    // Incrementing the Submissions no
                    QL_webweaver.dataRef.update({"submissions": no});
                    QL_webweaver.alert('success', '<i class="fa fa-thumbs-o-up"></i>', 'Message <strong>sent</strong>. Thanks.');
                } else {
                    QL_webweaver.alert('danger', '<i class="fa fa-warning"></i>', 'Message could <strong>NOT</strong> be sent. Try again.');
                }
                QL_webweaver.btnSubmit.innerHTML = "Send";
                QL_webweaver.btnSubmit.className = "btn btn-primary btn-block";
            });
            return;
        }, function (err) {
            // Error Occurred and Submission Number could not be retrieved
            QL_webweaver.alert('danger', '<i class="fa fa-warning"></i>', '<strong>ERROR</strong> occurred. We working to fix this.');
        });
    },
    init: function () {
        /*FIREBASE reference*/
        QL_webweaver.dataRef = new Firebase('https://quick-links.firebaseio.com/');
        /*Click functionality*/
        QL_webweaver.onClick();
    }
};

// If an error is caught by the engine, an alert box should appear
window.onerror = function (msg, url, line) {
    // Firebase is NOT defined 
    QL_webweaver.alert('danger', '<i class="fa fa-cogs fa-lg"></i>', "Message can <strong>NOT</strong> be sent. Try <strong>reloading</strong> the page to send a message.");
    QL_webweaver.btnSubmit.innerHTML = "CAN NOT SEND";
    QL_webweaver.btnSubmit.className += " disabled";
};

/*Document is READY and ALL JS Parsed by engine*/
$(document).ready(function () {
    QL_webweaver.init(); /*Initialization*/
});
