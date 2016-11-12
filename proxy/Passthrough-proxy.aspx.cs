using System;
using System.Web.UI;
using System.Net;
using System.Configuration;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ProcessRequest(this.Page);
    }

    public void ProcessRequest(Page context)
    {
        WebClient client = new WebClient();
        string BaseUrl = ConfigurationManager.AppSettings["PassthroughTargetURL"];
        string _url = BaseUrl;
        context.Response.AddHeader("Content-type","text/xml");
        string _out = client.DownloadString(_url);
        context.Response.Write(_out);
    }
}
