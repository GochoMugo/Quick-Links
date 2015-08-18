/**
 * Commonly-used utilties
 */


export default {
  notify,
  translate,
};


// built-in modules
import localization from "sdk/l10n";
import notifications from "sdk/notifications";


/**
 * Show a notification to the user
 */
function notify(title, text, func=function() {}) {
  return notifications.notify({
    title,
    text,
    onClick: func,
    iconURL: self.data.url("images/icon.png"),
  });
}


function translate(text) {
  return {
    aim: "translated",
    content: localization.get(text),
  };
}
