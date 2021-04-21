//api
// const API_URL_DOMAIN_KEY = 'https://api.webinarsystems.ru';
const API_URL_DOMAIN_KEY = 'https://localhost:44300';
const SOCKET_URL_KEY = 'https://vs.webinarsystems.ru/';
const WIDGET_HTML_KEY = 'https://webinarsystems.ru/cabinet/node_modules/canvas-designer/widget.html';
const WIDGET_JS_KEY = 'https://webinarsystems.ru/cabinet/node_modules/canvas-designer/widget.min.js'; 
const ERROR_URL_KEY = 'http://10.0.0.253:9001/errors'//'https://log.webinarsystems.ru/errors/add-error'; //

const VALID_FILE_TYPES = ['jpeg', 'png', 'pdf', 'jpg', 'txt', 'doc', 'rtf', 'xls', 'xlsx', 'JPEG', 'PNG', 'JPG', 'TXT', 'DOC', 'RTF', 'XLS', 'XLSX'];
const VALID_IMAGE_EXTENTIONS = ['jpeg', 'png', 'jpg', 'JPEG', 'PNG', 'JPG'];
const VALID_FILE_EXTENTIONS = ['pdf', 'PDF', 'txt', 'TXT', 'doc', 'DOC', 'rtf', 'RTF', 'xls', 'XLS', 'xlsx', 'XLSX'];
const LECTURER_USER_TYPE = 5;
const MESSAGE_NOTIFICATION_SOUND = '../assets/voices/message.mp3';

// webRTC
var currentUserStreamId;
var connectionWebRTC;
var designer;
var multiple = 2;
var timerNumber = 0;
var allParticipants = 0;

// variables
var reconnectiontDots = 0;
var reconnectionTimerCount = 0;
var reconnectionTimerInterval
var studentsTimersTimeout = null;
var currentUserStreamId = 'sOyej9lzPzI9oCHzg7cxtgpOLmV02ANAuxqb';
var isHasChatNotificationStyle = false
var isHasScreenShareNotificationStyle = false
var isHasTextBordNotificationStyle = false
var isHasBlackordNotificationStyle = false

var webinarScreenStateStatus = 0; // 0 - default status, 1 - webinar initial screen ready, 2 - webinar started
var allowPlayMessageSound = true;
var isInitialScreenReady = false;
var isScreenShareRequestSend = false;
var isScreenShareRequestSend = false;
var isLocalScreenShare = false;
var startButtonClicked = false;
var isMicrophoneMuted = false;
var isWebinarStarted = false;
var isChatMenuOpen = false;
var isSpeakerMuted = false;
var isVideoRequestSend = false;
var isVideoMuted = false;
var hideElement = false;
var isLecturer = false;
var textBoard = null;
var textTimeout;

var webinarOnlineUsers = [];
var webinarMessages = []; 
var webinarFiles = [];
var webinarUsers = [];
var messagesArr = [];
var languages = [];
var members = []

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + " " + today.getMilliseconds();

// signalR variables
var globalConnection;
var connection;
var correctUserTimeout = null;

var webinarResponseData;
var webinarCalendarId;
var currentUser;
var webinarData;
var webinarId;
var tokenData;
var lecturerData;

