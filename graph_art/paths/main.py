from PIL import Image, ImageDraw
import sys
from random import randrange



NUM_NODES = 10000
MAX_DEGREE = 100
MAX_DISTANCE_PERC = 0.05
DIFF_CUTOFF = 100

BACKGROUND_COLOR = (0,0,0)
BACKGROUND_CUTOFF = 100



MIN_OUT_WIDTH = 2000
CIRCLE_RADIUS = 3


path = sys.argv[1]

img = Image.open(path)
pix = img.load() #pix[x,y]
print(img.size)

xdim = img.size[0]
ydim = img.size[1]

nodes = []

for i in range(NUM_NODES):
    x = randrange(xdim)
    y = randrange(ydim)
    col = pix[x,y]
    background_diff = (col[0]-BACKGROUND_COLOR[0])**2 + (col[1]-BACKGROUND_COLOR[1])**2 + (col[2]-BACKGROUND_COLOR[2])**2
    if background_diff > BACKGROUND_CUTOFF**2:
        nodes.append([x,y,col])

NUM_NODES = len(nodes)

links = []
DIFF_CUTOFF_SQ = DIFF_CUTOFF*DIFF_CUTOFF
MAX_DISTANCE_PIX_SQ = (int)((xdim*MAX_DISTANCE_PERC)**2)

for i in range(NUM_NODES):
    node1 = nodes[i]
    col1 = node1[2]
    degree = 0
    for j in range(i+1, NUM_NODES):
        node2 = nodes[j]
        distance_sq = (node1[0]-node2[0])**2 + (node1[1]-node2[1])**2
        if distance_sq <= MAX_DISTANCE_PIX_SQ:
            col2 = node2[2]
            diff_sq = (col1[0]-col2[0])**2 + (col1[1]-col2[1])**2 + (col1[2]-col2[2])**2
            if diff_sq < DIFF_CUTOFF_SQ:
                links.append([i,j])
                degree += 1
                if degree >= MAX_DEGREE:
                    break

print(len(links))

fx = MIN_OUT_WIDTH * 1.0 / xdim

out = Image.new('RGBA', ((int)(xdim*fx), (int)(ydim*fx)), color = BACKGROUND_COLOR)


c = 0
for link in links:
    tmp = Image.new('RGBA', ((int)(xdim*fx), (int)(ydim*fx)), color = (0,0,0,0))
    draw = ImageDraw.Draw(tmp)
    sx = (int)(nodes[link[0]][0]*fx)
    sy = (int)(nodes[link[0]][1]*fx)
    ex = (int)(nodes[link[1]][0]*fx)
    ey = (int)(nodes[link[1]][1]*fx)

    draw.line((sx,sy,ex,ey), fill =(nodes[link[0]][2][0],nodes[link[0]][2][1],nodes[link[0]][2][2],100), width = 2)
    out = Image.alpha_composite(out, tmp)
    c+=1
    print(c)

draw = ImageDraw.Draw(out)
for node in nodes:
    nx = (int)(node[0]*fx)
    ny = (int)(node[1]*fx)
    draw.ellipse((nx-CIRCLE_RADIUS, ny-CIRCLE_RADIUS, nx+CIRCLE_RADIUS, ny+CIRCLE_RADIUS), fill = node[2], outline = node[2])



out.save('test.png')



