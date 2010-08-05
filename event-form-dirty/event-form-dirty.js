/**
 * An event that fires (once) when subscribed form is changed in any way.
 *
 * It uses change event delegation for clients that support it, but for clients
 * that don't you will need to detach and re-attach the listener if new form
 * elements are dynamically added to the form. But I figure this typically only
 * happens after input of some kind anyway, in which case the event already
 * fired.
 *
 * Usage:
 * YUI().use('event-form-dirty', function(Y) {
 *     Y.one('#myform').on('dirty', function(evt) {
 *         // evt.target is form (#myform)
 *         // evt.relatedTarget is field that changed
 *     });
 * });
 *
 * NOTE: Browser Inconsistencies
 *
 * 1. webkit (Safari, Chrome) trigger the change event on text fields even if
 * the change was undone before leaving the field.
 *
 *   Steps to verify:
 *   1. Add 'd' to the input text field containing 'foo' making 'food'
 *   2. Delete the 'd' before clicking off or tabbing away from the field
 *   3. Notice the change event has fired, even though the value remains at
 *   original value 'foo'
 *
 *   Not a bug, but an arguably too strict interpretation of the event…
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-htmlevents
 *   "The change event occurs when a control loses the input focus and its
 *   value has been modified since gaining focus. This event is valid for
 *   INPUT, SELECT, and TEXTAREA. element."
 *
 * 2. IE doesn't trigger change events on radio/checkbox fields until they lose focus.
 *
 *   Also not necessarily a bug according to the standard. In fact, you could
 *   argue IE is more closely following the spec in this case, but IMO the
 *   webkit and mozilla interpretations feel more natural.
 */
YUI.add('event-form-dirty', function(Y) {
    Y.Event.define('dirty', {
        publishConfig: { fireOnce: true },
        on: function (form, sub, notifier) {
            var fields = 'input,textarea,select';
            function onChange(evt) {
                notifier.fire({relatedTarget:evt.target});
            }
            if ('onchange' in document.createElement('form')) {
                sub.handles = [ Y.delegate('change', onChange, form, fields) ];
            } else {
                sub.handles = form.all(fields).on('change', onChange);
            }
        },
        detach: function (node, sub, notifier) {
            Y.Array.each(sub.handles, function(handle) {
                handle.detach();
            });
        }
    });
}, '3.2.0pr1', { requires: ['event-synthetic', 'event-delegate'] });
