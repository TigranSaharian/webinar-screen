//elements ids
const CONTAINER_FOOTER_ICONS = $('#mindalay-footer-center-btn-group');
const CONTAINER_FOOTER_LEFT_BUTTONS = $('#mindalay-footer-left-btn-group');
const CONTAINER_FOOTER_RIGHT_BUTTONS = $('#mindalay-footer-rigth-btn-group');
const CONTAINER_MAIN_BODY = $('#main-content');
const RIGHT_MENU_CHAT = $('#mindalay--right-chat-menu');
const RIGHT_MENU_DEFAULT = $('#mindalay--right-menu');
const RIGHT_MENU_CONTAINER = $('#right-menu-container');
const MINDALAY_MODAL_WINDOW = $('#mindalay--modal');
const MINDALAY_POPUP = $('#mindalay--footer-popup');
const MINDALAY_SCREEN_SHARE_CONTAINER = $('#mindalay-screen-share-container');
const PRELOADER = $('#preloader');
const BOARD_FOLDED_BUTONS = $('#board-folded-buttons')

// element classes
const MINDALAY_FOOTER_BUTTON = 'mindalay--footer-btn';
const MINDALAY_POPUP_BUTTON = 'popup-button';
const MINDALAY_BUTTON = 'mindalay--btn';
const MINDALAY_BUTTON_PRIMARY = 'mindalay--btn-primary mindalay--btn';
const MINDALAY_BUTTON_DARK = 'mindalay--btn-dark mindalay--btn';
const TRANSLATION = 'translation';
const PRELOADER_BUTTON = 'preloader-button';
const HAS_RIGHT_MENU = 'has-right-menu'
const HAS_BOARD = 'has-board'
const BOARD_TYPE = 'webinar-board-type'

const CLOSE_BOARD = 0
const TEXT_BOARD = 10
const BLACK_BOARD = 20
const SCREEN_SHARE_BOARD = 30

const REQUEST_ASK_VIDEO = 1
const REQUEST_ASK_SCREEN_SHARE = 2 

const ALERT_SUCCESS = 'alert-success'
const ALERT_DANGER = 'alert-danger'
const ALERT_INFO = 'alert-info'
const ALERT_WARNING = 'alert-warning'
const ALERT_DARK = 'alert-dark'

const MODAL_ACTIVITY_MEMBER = 'activity-member-modal'
const MODAL_SCREEN_SHAER = 'screen-share-modal'
const MODAL_RAISE_HAND = 'raise-hand-modal'

// constant texts
const PREFIX_POPUP = 'popup--';
const PREFIX_MEMBER_MENU = 'member-menu--'
const PREFIX_FILES_MENU = 'file-menu--'
const PREFIX_FOLD_BOARD_BUTTONS_GROUP = 'fold-board--'
const PREFIX_BOARD_BUTTONS_GROUP  = 'board--'
const POPUP_CONTAINER = '#popup-body';

const DATA_BOARD_ID = 'data-board-id'
const DATA_TOGGLE = 'data-toggle'
const DATA_BOARD_FOLDED = 'data-board-folded'

const SOCKET_MESSAGE_EVENT_KEY = 'rtc-connection-room-id'
// popup icons display
const MINDALAY_POPUP_ICONS = [
    'file-gallery',
    'members',
    'screen-share',
    'text-board',
    'blackboard',
    'mindalay-chat',
    'webinar-end',
    'report',
    'settings',
    'logout'
]