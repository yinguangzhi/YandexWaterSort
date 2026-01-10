
module.exports =
{
    /// <summary>
    /// 线性
    /// </summary>
    /// <param name="p0">起点</param>
    /// <param name="p1">终点</param>
    /// <param name="t">【0-1】</param>
    /// <returns></returns>
    // public static Vector3 BezierPoint(Vector3 p0, Vector3 p1, float t) {
    //     return (1 - t) * p0 + t * p1;
    // }

    /// <summary>
    /// 二阶曲线
    /// </summary>
    /// <param name="p0"></param>
    /// <param name="p1"></param>
    /// <param name="p2"></param>
    /// <param name="t"></param>
    /// <returns></returns>
    // public static Vector3 BezierPoint(Vector3 p0, Vector3 p1, Vector3 p2, float t) {
    //     Vector3 p0p1 = (1 - t) * p0 + t * p1;
    //     Vector3 p1p2 = (1 - t) * p1 + t * p2;
    //     Vector3 result = (1 - t) * p0p1 + t * p1p2;
    //         return result;
    //     }

    /// <summary>
    /// 三阶曲线
    /// </summary>
    /// <param name="p0"></param>
    /// <param name="p1"></param>
    /// <param name="p2"></param>
    /// <param name="p3"></param>
    /// <param name="t"></param>
    /// <returns></returns>
    // public static Vector3 BezierPoint(Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3, float t) {
    //     Vector3 result;
    //     Vector3 p0p1 = (1 - t) * p0 + t * p1;
    //     Vector3 p1p2 = (1 - t) * p1 + t * p2;
    //     Vector3 p2p3 = (1 - t) * p2 + t * p3;
    //     Vector3 p0p1p2 = (1 - t) * p0p1 + t * p1p2;
    //     Vector3 p1p2p3 = (1 - t) * p1p2 + t * p2p3;
    //         result = (1 - t) * p0p1p2 + t * p1p2p3;
    //         return result;
    //     }

    /// <summary>
    /// 多阶曲线  （可以递归 有多组线性组合）
    /// </summary>
    /// <param name="t"></param>
    /// <param name="p"></param>
    /// <returns></returns>
    BezierPoint(t, p) {
        if (p.length < 2) return p[0];

        let newP = [];
        for (let i = 0; i < p.length - 1; i++) {

            let p0p1 = (p[i].mul(1 - t)).add(p[i + 1].mul(t));
            newP.push(p0p1);
        }
        return this.BezierPoint(t, newP);
    },

    /// <summary>
    /// 获取存储贝塞尔曲线点的数组(二阶)
    /// </summary>
    /// <param name="startPoint">起始点</param>
    /// <param name="controlPoint">控制点</param>
    /// <param name="endPoint">目标点</param>
    /// <param name="segmentNum">采样点的数量</param>
    /// <returns>存储贝塞尔曲线点的数组</returns>
    // public static Vector3[] GetBeizerPointList(Vector3 startPoint, Vector3 controlPoint, Vector3 endPoint, int segmentNum)
    // {
    //     Vector3[] path = new Vector3[segmentNum];
    //     for (int i = 1; i <= segmentNum; i++)
    //     {
    //             float t = i / (float)segmentNum;
    //             Vector3 pixel = BezierPoint(startPoint, controlPoint, endPoint, t);
    //         path[i - 1] = pixel;
    //     }
    //     return path;
    // }

    /// <summary>
    /// 获取存储贝塞尔曲线点的数组(多阶)
    /// </summary>
    /// <param name="segmentNum">采样点的数量</param>
    /// <param name="p">控制点集合</param>
    /// <returns></returns>
    GetBezierPointList(segmentNum, p) {
        let path = [];
        for (let i = 1; i <= segmentNum; i++) {
            let t = i / segmentNum;
            let pixel = this.BezierPoint(t, p);
            path.push(pixel);
        }
        return path;
    },

    A : cc.v2(),
    B : cc.v2(),
    C : cc.v2(),
    D : cc.v2(),

    BezierExpand( p1, c1, c2,  p2)
    {
        this.A.x = -1 * p1.x + 3 * c1.x - 3 * c2.x + p2.x;
        this.A.y = -1 * p1.y + 3 * c1.y - 3 * c2.y + p2.y;

        this.B.x = 3 * p1.x - 6 * c1.x + 3 * c2.x;
        this.B.y = 3 * p1.y - 6 * c1.y + 3 * c2.y;

        this.C.x = -3 * p1.x + 3 * c1.x;
        this.C.y = -3 * p1.y + 3 * c1.y;

        this.D.x = p1.x;
        this.D.y = p1.y;
    },

    GetPointDer(t)
    {
        let _x = 3 * this.A.x * t * t + 2 * this.B.x * t + this.C.x;
        let _y = 3 * this.A.y * t * t + 2 * this.B.y * t + this.C.y;
        return cc.v2(_x,_y);
    },

    GetArcLength(t)
    {
        var halfT = t / 2;
        

        let sum = 0;
        // foreach (var wx in gaussWX)
        // {
        //     var w_i = wx[0];
        //     var x_i = wx[1];
        //     sum += w_i * GetPointDer(halfT * x_i + halfT).magnitude;
        // }
        sum *= halfT;
        return sum;
    },
    
    GetBezierPoint(p1,  c1, c2, p2,  t)
    {
        let rest = (1 - t);
        // p1*(1-t)^3 + 3*c1*t*(1-t)^2 + 3 *c2*t^2*(1-t) * p2*t^3
        let resultX = p1.x * rest * rest * rest + 3 * c1.x * t * rest * rest + 3 * c2.x * t * t * rest + p2.x * t * t * t;
        let resultY = p1.y * rest * rest * rest + 3 * c1.y * t * rest * rest + 3 * c2.y * t * t * rest + p2.y * t * t * t;
        return cc.v2(resultX,resultY);
    }
}