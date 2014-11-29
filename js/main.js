document.getElementByClass = function(n) { 
            var el = [],
                _el = document.getElementsByTagName('div');
            for (var i=0; i<_el.length; i++ ) {
 
                if (_el[i].className.substring(0,n.length) == n ) {
                    el[el.length] = _el[i];
                }
            }
            return el;
        }
function getElementByClass(documents,tag,n) { 
            var el = [],
                _el = documents.getElementsByTagName(tag);
            for (var i=0; i<_el.length; i++ ) {
 
                if (_el[i].className.substring(0,n.length) == n ) {
                    el[el.length] = _el[i];
                }
            }
            return el;
        }
document.getElementByHref = function(n) { 
            var el = [],
                _el = document.getElementsByTagName('div');
            for (var i=0; i<_el.length; i++ ) {
 
                if (_el[i].getAttribute("href").substring(0,n.length) == n ) {
                    el[el.length] = _el[i];
                }
            }
            return el;
        }
function getElementByHref(documents,n) { 
            var el = [],
                _el = documents.getElementsByTagName('a');
            for (var i=0; i<_el.length; i++ ) {
 
                if (_el[i].getAttribute("href").substring(0,n.length) == n ) {
                    el[el.length] = _el[i];
                }
            }
            return el;
        }
function ANSWER_INFO()
{
    this.usercount = 0
    this.answers = 0;  
    this.posts = 0;
    this.followers = 0;
    this.tripleZero = 0;
    this.anonymous = 0;
}

function parseDom(arg) { 
    var xmlDoc = null;
    xmlDoc = new DOMParser().parseFromString(arg, "text/xml");
    return xmlDoc
　　 //var objE = document.createElement("div"); 
　　 //objE.innerHTML = arg; 
　　 //return objE.childNodes; 
};  
 function parseDomNode(arg) { 

　　 var objE = document.createElement("div"); 
　　 objE.innerHTML = arg; 
　　 return objE.childNodes; 
};     
    function ajaxRequest(url,ids)
    {

        var xmlHttpRequest = null;
        if(window.ActiveXObject) // IE浏览器
        {
            xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if(window.XMLHttpRequest) // 除IE以外的其他浏览器
        {
            xmlHttpRequest = new XMLHttpRequest();
        }


        if(null != xmlHttpRequest)
        {
            //GET方式向服务器发出一个请求
            xmlHttpRequest.open("GET", url, true);
             
            // 当发生状态变化时就调用这个回调函数
            xmlHttpRequest.onreadystatechange = function(){
            if(xmlHttpRequest.readyState == 4)
            {
            //alert("aaaaaa"+ids);
                //alert(ids);

                if (xmlHttpRequest.status == 200) {

                var content = xmlHttpRequest.responseText;
                console.log(url)
                //document.getElementById("newEle"+ids).innerHTML += content;
                var UserDOM = parseDom(content);
                var users = getElementByClass(UserDOM,"a","zg-link-gray");
                //alert("user's length: "+users.length)
				if (users.length==0)
				{
					document.getElementById("newEle"+ids).innerHTML = "No Upper at all";
				}
                AnswerList[ids].anonymous = UserDOM.getElementsByTagName("span").length-2- users.length;

                for (var i in users)
                {
                    var tmp = users[i].getAttribute("href")

                    var uid = tmp.substring(8,tmp.length);
                    //alert(uid)

                    ajaxRequestUser(ids,uid);
                }
            }

            }}; ;
            
            // 向服务器发出一个请求
            xmlHttpRequest.send(null);    
        }

    }

    function ajaxRequestUser(ids,users)
    {
        
        var xmlHttpRequest = null;
        if(window.ActiveXObject) // IE浏览器
        {
            xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if(window.XMLHttpRequest) // 除IE以外的其他浏览器
        {
            xmlHttpRequest = new XMLHttpRequest();
        }
        //alert(users)
        var url = "http://www.zhihu.com/node/MemberProfileCardV2?params=%7B%22url_token%22%3A%22"+ users +"%22%7D"
        if(null != xmlHttpRequest)
        {
            //GET方式向服务器发出一个请求
            xmlHttpRequest.open("GET", url, true);
             
            // 当发生状态变化时就调用这个回调函数
            xmlHttpRequest.onreadystatechange = function(){
            if(xmlHttpRequest.readyState == 4)
            {
            //alert("aaaaaa"+ids);
                
                var content = xmlHttpRequest.responseText;
                var newDOM = parseDom(content);
                var newNodelist = parseDomNode(content);
                //alert(newNodelist.item(0).getElementsByTagName("span").length)
                //alert(new XMLSerializer().serializeToString(newDOM));
                //alert("s'")
                var values = getElementByClass(newNodelist.item(0),"span","value")
                //alert(values[0].textContent)
                var answers = values[0].textContent;
                var posts = values[1].textContent;
                var followers = values[2].textContent;
                AnswerList[ids].usercount+=1;
                AnswerList[ids].answers += parseInt(answers);
                AnswerList[ids].posts += parseInt(posts);
                AnswerList[ids].followers += parseInt(followers);
                if (answers=="0" && posts =="0" && followers=="0")
                {
                    AnswerList[ids].tripleZero+=1;
                }

                //alert("hahahahaha:::  "+ids+" "+users+" "+answers+" "+posts+" "+followers);
                document.getElementById("newEle"+ids).innerHTML = "Totally " +(AnswerList[ids].usercount+AnswerList[ids].anonymous)+" Uppers,Include "+AnswerList[ids].tripleZero+" tripleZero User "+"And "+AnswerList[ids].anonymous+" anonymous Uppers"+"<br>"
                                                                    +"Among all user ,three key values are " + AnswerList[ids].answers+" "+AnswerList[ids].posts+
                                                                    " "+AnswerList[ids].followers+"  "+"<br>";
            
            }}; ;
            
            // 向服务器发出一个请求
            xmlHttpRequest.send(null);    
        }

    }    
    
//userInformationUrl = "http://www.zhihu.com/node/MemberProfileCardV2?params=%7B%22url_token%22%3A%22"+userid+"%22%7D"
var greeting = "hola, ";

var mores = document.getElementByClass("zm-votebar");
//alert(mores.length)
AnswerList = new Array();
for (var i in mores)
{
    var s = document.createElement('div');
    s.style.borderColor = "#0769CD";
    s.style.borderStyle = "solid";
    s.style.borderWidth = "1px";
    s.style.backgroundColor = "#0769CD";
    s.style.color = "#FFFFFF" ;
    s.style.padding = "10px";
	s.style.cursor = "pointer"
    var ids = mores[i].parentNode.getAttribute('data-aid');
    s.innerHTML = "To be calculated";
    s.id = "newEle" +  ids;

    var askurl = "http://www.zhihu.com/node/AnswerFullVoteInfoV2?params=%7B%22answer_id%22%3A%22"+ ids +"%22%7D";
	
    ANSWER_INFO()
    AnswerList[ids] = new ANSWER_INFO();
    
//    s.onClick = new Function("alert('assdds');") function(){ 
//                            ajaxRequest(askurl, ids);}
    mores[i].parentNode.insertBefore(s, mores[i]);
    //ajaxRequest(askurl, ids);
    document.getElementById("newEle" +  ids).addEventListener('click',function () {
                                                                var id = this.getAttribute("id").substring(6,this.getAttribute("id").length);
                                                                var url = "http://www.zhihu.com/node/AnswerFullVoteInfoV2?params=%7B%22answer_id%22%3A%22"+ id +"%22%7D";
																if (AnswerList[id].usercount==0)
																	{ajaxRequest(url,id);}
																},false); 

}