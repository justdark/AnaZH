function ANSWER_INFO()
{
    this.usercount = 0
    this.answers = 0;  
    this.posts = 0;
    this.followers = 0;
    this.tripleZero = 0;
    this.anonymous = 0;
    this.female = 0;
    this.male = 0;
}

function parseDom(arg) { 
    var xmlDoc = null;
    xmlDoc = new DOMParser().parseFromString(arg, "text/html");
    return xmlDoc;
};  

//get all voters info 
function ajaxRequest(url,ids)
{
    var xmlHttpRequest = null;
    if(window.XMLHttpRequest)
    {
        xmlHttpRequest = new XMLHttpRequest();
    }

    if(null != xmlHttpRequest)
    {
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.onreadystatechange = function(){
            if (xmlHttpRequest.readyState == 4){
                if (xmlHttpRequest.status == 200) {
                    var content = xmlHttpRequest.responseText;
                    var UserDOM = parseDom(content);
                    var users = UserDOM.getElementsByTagName("a");
                    if (users.length==0){
                        document.getElementById("newEle"+ids).innerHTML = "No Upper at all";
                    }
                    AnswerList[ids].anonymous = UserDOM.getElementsByTagName("span").length-2- users.length;
                    for (var i in users)
                    {
                        var tmp = users[i].getAttribute("href");
                        var uid = tmp.substring(8,tmp.length);
                        ajaxRequestUser(ids,uid);
                    }
                }
            }
        }
        xmlHttpRequest.send(null); 
    }
}

//get user detail info
function ajaxRequestUser(ids,users)
{

    var xmlHttpRequest = null;
    if(window.XMLHttpRequest)
    {
        xmlHttpRequest = new XMLHttpRequest();
    }
    var url = "http://www.zhihu.com/node/MemberProfileCardV2?params=%7B%22url_token%22%3A%22"+ users +"%22%7D"
    if(null != xmlHttpRequest)
    {
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.onreadystatechange = function(){
            if(xmlHttpRequest.readyState == 4)
            {
                var content = xmlHttpRequest.responseText;
                var newDOM = parseDom(content);
                AnswerList[ids].male += newDOM.getElementsByClassName("icon icon-profile-male").length
                AnswerList[ids].female += newDOM.getElementsByClassName("icon icon-profile-female").length
                var values = newDOM.getElementsByClassName("value");
                var answers = values[0].innerHTML;
                var posts = values[1].innerHTML;
                var followers = values[2].innerHTML;
                AnswerList[ids].usercount+=1;
                AnswerList[ids].answers += parseInt(answers);
                AnswerList[ids].posts += parseInt(posts);
                AnswerList[ids].followers += parseInt(followers);
                if (answers=="0" && posts =="0" && followers=="0")
                {
                    AnswerList[ids].tripleZero+=1;
                }
                male_per = Math.floor((AnswerList[ids].male*1.0/AnswerList[ids].usercount).toFixed(2)*100);
                female_per = Math.floor((AnswerList[ids].female*1.0/AnswerList[ids].usercount).toFixed(2)*100);
                document.getElementById("newEle"+ids).innerHTML = "Totally " +(AnswerList[ids].usercount+AnswerList[ids].anonymous)+" voters, Include "+AnswerList[ids].tripleZero+" tripleZero voters "+"And "+AnswerList[ids].anonymous+" anonymous voters"+"<br>"
                +"with "+ AnswerList[ids].male +"  males(" +male_per+"%)  and  "+AnswerList[ids].female + "  females(" +female_per+"%) <br>"
                +"Among all voters, aggregate amount is #Answers: " + AnswerList[ids].answers+"  #Posts: "+AnswerList[ids].posts+
                "  #Followers: "+AnswerList[ids].followers+"  "+"<br>";
            }
        }
        xmlHttpRequest.send(null);    
    }

}    

//main
var mores = document.getElementsByClassName("zm-votebar");
AnswerList = new Array();
for (var i = 0; i < mores.length; ++i)
{
    var s = document.createElement('div');
    var ids = mores[i].parentNode.getAttribute('data-aid');
    s.innerHTML = "To be calculated";
    s.setAttribute("class","stat-addon");
    s.id = "newEle" +  ids;

    var askurl = "http://www.zhihu.com/node/AnswerFullVoteInfoV2?params=%7B%22answer_id%22%3A%22"+ ids +"%22%7D";

    ANSWER_INFO()
    AnswerList[ids] = new ANSWER_INFO();

    mores[i].parentNode.insertBefore(s, mores[i]);
    document.getElementById("newEle" +  ids)
    .addEventListener('click',function () {
        var id = this.getAttribute("id").substring(6,this.getAttribute("id").length);
        var url = "http://www.zhihu.com/node/AnswerFullVoteInfoV2?params=%7B%22answer_id%22%3A%22"+ id +"%22%7D";
        if (AnswerList[id].usercount==0) {
            ajaxRequest(url,id);
            console.log("click");
        }
    },false); 

}
