/**
 * Commonly-used utilties
 */


export default {
  notify,
  localize,
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


/**
 * Translate some text to the user's locale
 *
 * @param {String} tag - tag for the text to localize
 */
function localize(tag) {
  return {
    aim: "translated",
    content: localization.get(tag),
  };
}
