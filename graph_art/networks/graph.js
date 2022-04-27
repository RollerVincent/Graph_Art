
var MAX_DEGREE = 100;
var MAX_NODES = 10000;
var MAX_DISTANCE_PERC = 0.05;
var DIFF_CUTOFF = 100;

var BACKGROUND_COLOR = [0,0,0];
var BACKGROUND_CUTOFF = 100;

var MIN_OUT_WIDTH = 2000;
var CIRCLE_RADIUS = 1;
var LINE_WIDTH = 1;
var LINK_OPACITY = 0.1;

var SCALE;

var nodes = [];
var links = [];

function init_canvas(){
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", dim[0]*SCALE);
    canvas.setAttribute("height", dim[1]*SCALE);
}

function set_background(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb("+BACKGROUND_COLOR[0]+","+BACKGROUND_COLOR[1]+","+BACKGROUND_COLOR[2]+")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function create_graph(){
    links = [];
    var DIFF_CUTOFF_SQ = DIFF_CUTOFF*DIFF_CUTOFF;
    var MAX_DISTANCE_PIX_SQ = Math.round((dim[0]*MAX_DISTANCE_PERC)**2);
    for (let i = 0; i < nodes.length; i++) {
        var node1 = nodes[i];
        var degree = 0;
        for (let j = i+1; j < nodes.length; j++) {
            var node2 = nodes[j];

            var distance_sq = (node1.x-node2.x)**2 + (node1.y-node2.y)**2;
            if (distance_sq <= MAX_DISTANCE_PIX_SQ){
                
                var diff_sq = (node1.col[0]-node2.col[0])**2 + (node1.col[1]-node2.col[1])**2 + (node1.col[2]-node2.col[2])**2;
                if (diff_sq < DIFF_CUTOFF_SQ){
                    links.push([i,j]);
                    degree += 1;
                    if (degree >= MAX_DEGREE){
                        break;
                    }
                }
            }
            
        }
    }
    console.log(links.length);
}

function filter_nodes(){
    nodes = [];
    var c2 = BACKGROUND_CUTOFF**2;
    for (let i = 0; i < Math.min(image_data.length-1, MAX_NODES); i++) {
        var node = image_data[i];
        var diff = (BACKGROUND_COLOR[0]-node.col[0])**2 + (BACKGROUND_COLOR[1]-node.col[1])**2 + (BACKGROUND_COLOR[2]-node.col[2])**2;
        if (diff > c2){
            nodes.push(node);
        }
    
    }
}

function draw_nodes(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    for (let i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        ctx.beginPath();
        ctx.arc(node.x*SCALE, node.y*SCALE, CIRCLE_RADIUS*SCALE, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba("+node.col[0]+","+node.col[1]+","+node.col[2]+", 1.0)";
        ctx.fill();
    }
}

function draw_links(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    
    ctx.lineWidth = LINE_WIDTH*SCALE;

    for (let i = 0; i < links.length; i++) {
        var node1 = nodes[links[i][0]];
        var node2 = nodes[links[i][1]];
        var x1 = node1.x * SCALE;
        var y1 = node1.y * SCALE;
        var x2 = node2.x * SCALE;
        var y2 = node2.y * SCALE;


        var grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba("+node1.col[0]+","+node1.col[1]+","+node1.col[2]+", "+LINK_OPACITY+")");
        grad.addColorStop(1, "rgba("+node2.col[0]+","+node2.col[1]+","+node2.col[2]+", "+LINK_OPACITY+")");
    
        ctx.strokeStyle = grad;
        
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
    
        ctx.stroke();
    }

    

}

function init_download_button(){
    document.getElementById('downloader').onclick = function (){
        document.getElementById("downloader").download = "result_"+Date.now()+".png";
        document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    };
}

function redraw(){
        SCALE = Math.round(MIN_OUT_WIDTH*1.0/dim[0]);

        filter_nodes();
        create_graph();
        init_canvas();
        set_background();
        draw_links();
        draw_nodes();
}

function init_update_button(){
    document.getElementById("update_button").onclick = function(){
        var color = document.getElementById("i_backcol").value;
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        BACKGROUND_COLOR = [r,g,b];
        MAX_DEGREE = parseInt(document.getElementById("i_deg").value);
        MAX_DISTANCE_PERC = parseFloat(document.getElementById("i_dist").value);
        DIFF_CUTOFF = parseFloat(document.getElementById("i_clus").value);
        BACKGROUND_CUTOFF = parseFloat(document.getElementById("i_backc").value);
        CIRCLE_RADIUS = parseFloat(document.getElementById("i_nrad").value);
        LINE_WIDTH = parseFloat(document.getElementById("i_lwid").value);
        LINK_OPACITY = parseFloat(document.getElementById("i_lop").value);
        MIN_OUT_WIDTH = parseFloat(document.getElementById("i_wid").value);
        MAX_NODES = parseInt(document.getElementById("i_nodes").value);

        redraw();
    }
}




