/**
 * has a dependency on components/Messages.js
 */

export const autoscroll = () => {
  const $messagesWrap = document.querySelector("#messages");
  const $messages = document.querySelector("#messages div");
  // New message element
  const $newMessage = $messages.lastElementChild;
  if ($newMessage !== null) {
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messagesWrap.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled
    const scrollOffset = $messagesWrap.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
      // scroll to bottom
      $messagesWrap.scrollTop = $messagesWrap.scrollHeight;
    }
  }
};
