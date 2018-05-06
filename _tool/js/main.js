var data = {
	SETUP: {}
},
objectName = '',
pagesLists = ['index'],
dataSites = {
	color: 'main: #2e3192,extra: #ec8b00,front: #659f13,back: #f1c40f,cyan-1: #1abc9c,cyan-2: #16a085,la-1: #2ecc71,la-2: #27ae60,duong-1: #3498db,duong-2: #2980b9,tim-1: #9b59b6,tim-2: #8e44ad,vang-1: #f1c40f,vang-2: #f39c12,cam-1: #e67e22,cam-2: #d35400,do-1: #e74c3c,do-2: #c0392b,den-1: #34495e,den-2: #2c3e50,xam-1: #95a5a6,xam-2: #7f8c8d,hong-1: #ff9ff3,hong-2: #f368e0,trang: #ffffff,den: #000000',
	js: '"ACTIVE_FIXED_HEADER": false,"HEADER_TRANPARENT": false,"ACTIVE_HEADER_POSITION": 1,"ACTIVE_PADDING_MAIN": true,"ACTIVE_VALIDATOR": true,"ACTIVE_SELECT": true,"ACTIVE_FIXED_FOOTER": true,"ACTIVE_LIST_TO_SELECT": true,"DISPLAY_FOOTER": 600,"ACTIVE_RESPONSIVE": true,"ACTIVE_BACKTOTOP": true,"DISPLAY_BACKTOTOP": 100,"CHANGE_GRID": 991,"CHANGE_GRID_SM": 767,"DEV_MODE": false,"DEV_MODE_GIRD_FULL": false'
}

function setDefault() {
	var dataColor, dataJS;
	dataColor = "$mau: (" + dataSites.color + ")"
	dataJS = "const CANHCAM_APP = {" + dataSites.js + "}"
	saveToData(dataColor.toString(), dataJS.toString())
}

function createPageBuilder(toAdd) {
	data.SETUP[toAdd] = []
	$('.newlist').each(function (i, e) {
		var sortable = new Sortable.create(e, {
			group: {
				put: 'mainList',
				pull: false
			},
			chosenClass: "sortable-chosen",
			onClone: function (evt) {
				getlist()
			},
			onRemove: function (evt) {
				getlist()
			},
			onAdd: function (evt) {
				getlist()
				var itemEl = evt.item
				var gname = $(itemEl).attr('data-key').replace('/', '-')
				var getid = taoIdNgauNhien()
				$(itemEl).append('<div id="' + getid + '" class="ifthumnails"><iframe src="./templates/index-' + gname + '.html" frameborder="0" onload="this.style.opacity = 1"></iframe></div>')
				setTimeout(() => {
					var abc = $('#' + getid + ' iframe').contents().height()
					$('#' + getid).css({
						"height": abc + 'px'
					})
					$('#' + getid + ' iframe').css({
						"height": abc + 'px'
					})
				}, 1000);
			},
			onUpdate: function (evt) {
				getlist()
				var itemEl = evt.item
				$(itemEl).find('iframe').removeAttr('style')
				setTimeout(() => {
					var abc = $(itemEl).find('iframe').contents().height()
					$(itemEl).find('iframe').css({
						"height": abc + 'px'
					})
				}, 3000);
			},
			onEnd: function (evt) {
				getlist()
			},
			animation: 100
		});
		$('.mainList').on('dragenter', function () {
			$('.sortable-ghost', e).remove();
		});

		function getlist() {
			$('.newlist').each(function () {
				if ($('.newlist').html().trim().length > 0) {
					$(this).addClass('cnt')
				} else {
					$(this).removeClass('cnt')
				}
			})
			var optionTexts = {
				header: [],
				body: [],
				footer: []
			};
			$(e).find(".list-group-item").each(function () {
				if ($(this).attr("data-type") === 'header') {
					optionTexts.header.push($(this).attr("data-key"))
				} else if ($(this).attr("data-type") === 'body') {
					optionTexts.body.push($(this).attr("data-key"))
				} else {
					optionTexts.footer.push($(this).attr("data-key"))
				}
			});
			data.SETUP[toAdd] = optionTexts
			// console.log(data)
		}
	})
}

function taoTrangIndex() {
	if (pagesLists.length == 1) {
		var toAdd = "index";
		$('.noleft .nav-tabs').append('<li class="nav-item"><a class="nav-link" id="' + toAdd + '-tab" data-toggle="tab" href="#' + toAdd + '" role="tab" aria-controls="' + toAdd + '" aria-selected="true">' + toAdd + '.html</a></li>');
		$('.noleft #nav-tabContent').append('<div class="tab-pane fade" id="' + toAdd + '" role="tabpanel" aria-labelledby="' + toAdd + '-tab"><div class="list-group newlist"></div></div>');
		$('#toDoList')[0].reset();
		$('#' + toAdd + '-tab').trigger('click')
		createPageBuilder(toAdd)
		checkTab()
	}
}

$('#buttonListItemMain').click(function () {
	var toAdd = removeVietnam($('input[name=ListItemMain]').val().trim());
	if (toAdd) {
		objectName = toAdd
		$('#projectname').html("" + objectName + "")
		$('#toDoListMain').hide()
		$('#toDoListMain')[0].reset();
		$('#toDoList').show()
		$('#accordion').toggleClass('active')
		alert('Thêm dự án thành công!, hãy tiếp tục tạo page trên dự án.')
		taoTrangIndex()
	} else {
		return false
	}
});

$('#createSite').click(function (e) {
	e.preventDefault();
	var newData = data
	if (confirm("Bạn có chắc chắn tạo site ngay bây giờ?")) {
		jQuery.post("/createsite", {
			name: objectName,
			data: newData
		}, function (data) {
			if (data === 'done') {
				$('#toDoListMain').show()
				$('#toDoList, .deview').hide()
				$('.notedcanhcam').show()
				$('.notedcanhcam .alert').show()
				$('.createcanhcam').hide()
				$('.enterpro').hide()
				$('#myTab').removeClass('cnt')
				$('#myTab, #nav-tabContent').html('')
				data = {
					SETUP: {}
				}
				objectName = ''
				pagesLists = ['index']
			}
		});
	} else {
		return false
	}
});

$('#createPage').click(function () {
	var toAdd = removeVietnam($('input[name=ListItem]').val().trim());
	if (!kiemTraTenTrang(toAdd, pagesLists)) {
		if (toAdd) {
			$('.noleft .nav-tabs').append('<li class="nav-item"><a class="nav-link" id="' + toAdd + '-tab" data-toggle="tab" href="#' + toAdd + '" role="tab" aria-controls="' + toAdd + '" aria-selected="true">' + toAdd + '.html<span class="btn btn-sm btn-danger xoatab" data-id="' + toAdd + '"><i class="fa fa-close"></i></span></a></li>');
			$('.noleft #nav-tabContent').append('<div class="tab-pane fade" id="' + toAdd + '" role="tabpanel" aria-labelledby="' + toAdd + '-tab"><div class="list-group newlist"></div></div>');
			$('#toDoList')[0].reset();
			$('#' + toAdd + '-tab').trigger('click')
			createPageBuilder(toAdd)
			checkTab()
			pagesLists.push(toAdd)
		} else {
			return false
		}
	} else {
		alert('Chưa nhập tên hoặc đã tồn tại trang này!')
		$('#toDoList')[0].reset();
	}
});


