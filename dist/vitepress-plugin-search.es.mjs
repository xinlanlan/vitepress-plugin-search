import MarkdownIt from "markdown-it";
import * as fs from "fs/promises";
const rControl = /[\u0000-\u001f]/g, rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, rCombining = /[\u0300-\u036F]/g, slugify = (e) => e.normalize("NFKD").replace(rCombining, "").replace(rControl, "").replace(rSpecial, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").replace(/^(\d)/, "_$1").toLowerCase();
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, globToRegexp = function(e, n) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  for (var i = String(e), r = "", s = n ? !!n.extended : !1, o = n ? !!n.globstar : !1, l = !1, h = n && typeof n.flags == "string" ? n.flags : "", f, p = 0, m = i.length; p < m; p++)
    switch (f = i[p], f) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        r += "\\" + f;
        break;
      case "?":
        if (s) {
          r += ".";
          break;
        }
      case "[":
      case "]":
        if (s) {
          r += f;
          break;
        }
      case "{":
        if (s) {
          l = !0, r += "(";
          break;
        }
      case "}":
        if (s) {
          l = !1, r += ")";
          break;
        }
      case ",":
        if (l) {
          r += "|";
          break;
        }
        r += "\\" + f;
        break;
      case "*":
        for (var A = i[p - 1], y = 1; i[p + 1] === "*"; )
          y++, p++;
        var w = i[p + 1];
        if (!o)
          r += ".*";
        else {
          var g = y > 1 && (A === "/" || A === void 0) && (w === "/" || w === void 0);
          g ? (r += "((?:[^/]*(?:/|$))*)", p++) : r += "([^/]*)";
        }
        break;
      default:
        r += f;
    }
  return (!h || !~h.indexOf("g")) && (r = "^" + r + "$"), new RegExp(r, h);
};
const { readdir, readFile } = fs;
let rootPath = "";
const replaceMdSyntax = (e) => e.replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/(\*+)(\s*\b)([^\*]*)(\b\s*)(\*+)/gm, "$3"), match = (e, n) => {
  let i = !1;
  for (const r of n)
    if (r instanceof RegExp) {
      if (r.test(e)) {
        i = !0;
        break;
      }
    } else if (typeof r == "string" && globToRegexp(r).test(e)) {
      i = !0;
      break;
    }
  return i;
}, getFileList = async (e, n) => {
  var s, o;
  let i = [];
  const r = await readdir(e, { withFileTypes: !0 });
  for (const l of r)
    ((s = n == null ? void 0 : n.allow) == null ? void 0 : s.length) > 0 && !match(`${e}/${l.name}`, n.allow) || ((o = n == null ? void 0 : n.ignore) == null ? void 0 : o.length) > 0 && match(`${e}/${l.name}`, n.ignore) || (l.isDirectory() && l.name != "node_modules" ? i = [
      ...i,
      ...await getFileList(`${e}/${l.name}`, n)
    ] : l.name.endsWith(".md") && i.push(`${e}/${l.name}`));
  return i;
}, removeFrontMatter = (e) => e.replace(/^---(.|\W)*?---/, ""), removeScriptTag = (e) => e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim(), removeStyleTag = (e) => e.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").trim(), processMdFiles = async (e, n) => {
  rootPath = e;
  let i = await getFileList(e, n), r = [];
  for (let s = 0; s < i.length; s++) {
    const o = i[s];
    let l = await readFile(o, { encoding: "utf8" }), h = removeStyleTag(
      removeScriptTag(replaceMdSyntax(removeFrontMatter(l)))
    );
    r.push({ content: h, path: o });
  }
  return Promise.resolve(r);
}, parseMdContent = (e, n) => e.split(/(^|\s)#{2,}\s/gi).filter((o) => o != "" && o != `
`).map((o) => {
  let l = o.split(`
`);
  return { anchor: (l == null ? void 0 : l.shift()) || "", content: l.join(`
`), path: n };
}), buildDoc = (e, n) => {
  let i, r, s = r = e.anchor;
  (i = /\{(.*?)\}/m.exec(e.anchor)) !== null && (s = i[0], r = e.anchor.replace(/\{(.*?)\}/m, "")), s = slugify(s), s[0] == "#" && (s = s.replace("#", ""));
  let o = e.path.replace(rootPath + "/", "").replace("md", "html");
  return n.includes(".0") || (o += `#${slugify(s)}`), {
    id: n,
    link: o,
    b: e.content,
    a: s,
    t: r
  };
}, buildDocs = async (e, n) => {
  const i = await processMdFiles(e, n), r = [];
  if (i !== void 0)
    for (let s = 0; s < i.length; s++) {
      const o = i[s];
      let l = parseMdContent(o.content, o.path);
      for (let h = 0; h < l.length; h++) {
        const f = l[h];
        r.push(buildDoc(f, s + "." + h));
      }
    }
  return r;
};
var flexsearch_bundleExports = {}, flexsearch_bundle = {
  get exports() {
    return flexsearch_bundleExports;
  },
  set exports(e) {
    flexsearch_bundleExports = e;
  }
};
(function(module) {
  (function _f(self) {
    try {
      module && (self = module);
    } catch (e) {
    }
    self._factory = _f;
    var t;
    function u(e) {
      return typeof e < "u" ? e : !0;
    }
    function aa(e) {
      const n = Array(e);
      for (let i = 0; i < e; i++)
        n[i] = v();
      return n;
    }
    function v() {
      return /* @__PURE__ */ Object.create(null);
    }
    function ba(e, n) {
      return n.length - e.length;
    }
    function x(e) {
      return typeof e == "string";
    }
    function C(e) {
      return typeof e == "object";
    }
    function D(e) {
      return typeof e == "function";
    }
    function ca(e, n) {
      var i = da;
      if (e && (n && (e = E(e, n)), this.H && (e = E(e, this.H)), this.J && 1 < e.length && (e = E(e, this.J)), i || i === "")) {
        if (e = e.split(i), this.filter) {
          n = this.filter, i = e.length;
          const r = [];
          for (let s = 0, o = 0; s < i; s++) {
            const l = e[s];
            l && !n[l] && (r[o++] = l);
          }
          e = r;
        }
        return e;
      }
      return e;
    }
    const da = /[\p{Z}\p{S}\p{P}\p{C}]+/u, ea = /[\u0300-\u036f]/g;
    function fa(e, n) {
      const i = Object.keys(e), r = i.length, s = [];
      let o = "", l = 0;
      for (let h = 0, f, p; h < r; h++)
        f = i[h], (p = e[f]) ? (s[l++] = F(n ? "(?!\\b)" + f + "(\\b|_)" : f), s[l++] = p) : o += (o ? "|" : "") + f;
      return o && (s[l++] = F(n ? "(?!\\b)(" + o + ")(\\b|_)" : "(" + o + ")"), s[l] = ""), s;
    }
    function E(e, n) {
      for (let i = 0, r = n.length; i < r && (e = e.replace(n[i], n[i + 1]), e); i += 2)
        ;
      return e;
    }
    function F(e) {
      return new RegExp(e, "g");
    }
    function ha(e) {
      let n = "", i = "";
      for (let r = 0, s = e.length, o; r < s; r++)
        (o = e[r]) !== i && (n += i = o);
      return n;
    }
    var ja = { encode: ia, F: !1, G: "" };
    function ia(e) {
      return ca.call(this, ("" + e).toLowerCase(), !1);
    }
    const ka = {}, G = {};
    function la(e) {
      I(e, "add"), I(e, "append"), I(e, "search"), I(e, "update"), I(e, "remove");
    }
    function I(e, n) {
      e[n + "Async"] = function() {
        const i = this, r = arguments;
        var s = r[r.length - 1];
        let o;
        return D(s) && (o = s, delete r[r.length - 1]), s = new Promise(function(l) {
          setTimeout(function() {
            i.async = !0;
            const h = i[n].apply(i, r);
            i.async = !1, l(h);
          });
        }), o ? (s.then(o), this) : s;
      };
    }
    function ma(e, n, i, r) {
      const s = e.length;
      let o = [], l, h, f = 0;
      r && (r = []);
      for (let p = s - 1; 0 <= p; p--) {
        const m = e[p], A = m.length, y = v();
        let w = !l;
        for (let g = 0; g < A; g++) {
          const k = m[g], $ = k.length;
          if ($)
            for (let R = 0, j, _; R < $; R++)
              if (_ = k[R], l) {
                if (l[_]) {
                  if (!p) {
                    if (i)
                      i--;
                    else if (o[f++] = _, f === n)
                      return o;
                  }
                  (p || r) && (y[_] = 1), w = !0;
                }
                if (r && (j = (h[_] || 0) + 1, h[_] = j, j < s)) {
                  const B = r[j - 2] || (r[j - 2] = []);
                  B[B.length] = _;
                }
              } else
                y[_] = 1;
        }
        if (r)
          l || (h = y);
        else if (!w)
          return [];
        l = y;
      }
      if (r)
        for (let p = r.length - 1, m, A; 0 <= p; p--) {
          m = r[p], A = m.length;
          for (let y = 0, w; y < A; y++)
            if (w = m[y], !l[w]) {
              if (i)
                i--;
              else if (o[f++] = w, f === n)
                return o;
              l[w] = 1;
            }
        }
      return o;
    }
    function na(e, n) {
      const i = v(), r = v(), s = [];
      for (let o = 0; o < e.length; o++)
        i[e[o]] = 1;
      for (let o = 0, l; o < n.length; o++) {
        l = n[o];
        for (let h = 0, f; h < l.length; h++)
          f = l[h], i[f] && !r[f] && (r[f] = 1, s[s.length] = f);
      }
      return s;
    }
    function J(e) {
      this.l = e !== !0 && e, this.cache = v(), this.h = [];
    }
    function oa(e, n, i) {
      C(e) && (e = e.query);
      let r = this.cache.get(e);
      return r || (r = this.search(e, n, i), this.cache.set(e, r)), r;
    }
    J.prototype.set = function(e, n) {
      if (!this.cache[e]) {
        var i = this.h.length;
        for (i === this.l ? delete this.cache[this.h[i - 1]] : i++, --i; 0 < i; i--)
          this.h[i] = this.h[i - 1];
        this.h[0] = e;
      }
      this.cache[e] = n;
    }, J.prototype.get = function(e) {
      const n = this.cache[e];
      if (this.l && n && (e = this.h.indexOf(e))) {
        const i = this.h[e - 1];
        this.h[e - 1] = this.h[e], this.h[e] = i;
      }
      return n;
    };
    const qa = { memory: { charset: "latin:extra", D: 3, B: 4, m: !1 }, performance: { D: 3, B: 3, s: !1, context: { depth: 2, D: 1 } }, match: { charset: "latin:extra", G: "reverse" }, score: { charset: "latin:advanced", D: 20, B: 3, context: { depth: 3, D: 9 } }, default: {} };
    function ra(e, n, i, r, s, o, l) {
      setTimeout(function() {
        const h = e(i ? i + "." + r : r, JSON.stringify(l));
        h && h.then ? h.then(function() {
          n.export(e, n, i, s, o + 1);
        }) : n.export(e, n, i, s, o + 1);
      });
    }
    function K(e, n) {
      if (!(this instanceof K))
        return new K(e);
      var i;
      if (e) {
        x(e) ? e = qa[e] : (i = e.preset) && (e = Object.assign({}, i[i], e)), i = e.charset;
        var r = e.lang;
        x(i) && (i.indexOf(":") === -1 && (i += ":default"), i = G[i]), x(r) && (r = ka[r]);
      } else
        e = {};
      let s, o, l = e.context || {};
      if (this.encode = e.encode || i && i.encode || ia, this.register = n || v(), this.D = s = e.resolution || 9, this.G = n = i && i.G || e.tokenize || "strict", this.depth = n === "strict" && l.depth, this.l = u(l.bidirectional), this.s = o = u(e.optimize), this.m = u(e.fastupdate), this.B = e.minlength || 1, this.C = e.boost, this.map = o ? aa(s) : v(), this.A = s = l.resolution || 1, this.h = o ? aa(s) : v(), this.F = i && i.F || e.rtl, this.H = (n = e.matcher || r && r.H) && fa(n, !1), this.J = (n = e.stemmer || r && r.J) && fa(n, !0), i = n = e.filter || r && r.filter) {
        i = n, r = v();
        for (let h = 0, f = i.length; h < f; h++)
          r[i[h]] = 1;
        i = r;
      }
      this.filter = i, this.cache = (n = e.cache) && new J(n);
    }
    t = K.prototype, t.append = function(e, n) {
      return this.add(e, n, !0);
    }, t.add = function(e, n, i, r) {
      if (n && (e || e === 0)) {
        if (!r && !i && this.register[e])
          return this.update(e, n);
        if (n = this.encode(n), r = n.length) {
          const p = v(), m = v(), A = this.depth, y = this.D;
          for (let w = 0; w < r; w++) {
            let g = n[this.F ? r - 1 - w : w];
            var s = g.length;
            if (g && s >= this.B && (A || !m[g])) {
              var o = L(y, r, w), l = "";
              switch (this.G) {
                case "full":
                  if (2 < s) {
                    for (o = 0; o < s; o++)
                      for (var h = s; h > o; h--)
                        if (h - o >= this.B) {
                          var f = L(y, r, w, s, o);
                          l = g.substring(o, h), M(this, m, l, f, e, i);
                        }
                    break;
                  }
                case "reverse":
                  if (1 < s) {
                    for (h = s - 1; 0 < h; h--)
                      l = g[h] + l, l.length >= this.B && M(
                        this,
                        m,
                        l,
                        L(y, r, w, s, h),
                        e,
                        i
                      );
                    l = "";
                  }
                case "forward":
                  if (1 < s) {
                    for (h = 0; h < s; h++)
                      l += g[h], l.length >= this.B && M(this, m, l, o, e, i);
                    break;
                  }
                default:
                  if (this.C && (o = Math.min(o / this.C(n, g, w) | 0, y - 1)), M(this, m, g, o, e, i), A && 1 < r && w < r - 1) {
                    for (s = v(), l = this.A, o = g, h = Math.min(A + 1, r - w), s[o] = 1, f = 1; f < h; f++)
                      if ((g = n[this.F ? r - 1 - w - f : w + f]) && g.length >= this.B && !s[g]) {
                        s[g] = 1;
                        const k = this.l && g > o;
                        M(this, p, k ? o : g, L(l + (r / 2 > l ? 0 : 1), r, w, h - 1, f - 1), e, i, k ? g : o);
                      }
                  }
              }
            }
          }
          this.m || (this.register[e] = 1);
        }
      }
      return this;
    };
    function L(e, n, i, r, s) {
      return i && 1 < e ? n + (r || 0) <= e ? i + (s || 0) : (e - 1) / (n + (r || 0)) * (i + (s || 0)) + 1 | 0 : 0;
    }
    function M(e, n, i, r, s, o, l) {
      let h = l ? e.h : e.map;
      (!n[i] || l && !n[i][l]) && (e.s && (h = h[r]), l ? (n = n[i] || (n[i] = v()), n[l] = 1, h = h[l] || (h[l] = v())) : n[i] = 1, h = h[i] || (h[i] = []), e.s || (h = h[r] || (h[r] = [])), o && h.includes(s) || (h[h.length] = s, e.m && (e = e.register[s] || (e.register[s] = []), e[e.length] = h)));
    }
    t.search = function(e, n, i) {
      i || (!n && C(e) ? (i = e, e = i.query) : C(n) && (i = n));
      let r = [], s, o, l = 0;
      if (i) {
        e = i.query || e, n = i.limit, l = i.offset || 0;
        var h = i.context;
        o = i.suggest;
      }
      if (e && (e = this.encode("" + e), s = e.length, 1 < s)) {
        i = v();
        var f = [];
        for (let m = 0, A = 0, y; m < s; m++)
          if ((y = e[m]) && y.length >= this.B && !i[y])
            if (this.s || o || this.map[y])
              f[A++] = y, i[y] = 1;
            else
              return r;
        e = f, s = e.length;
      }
      if (!s)
        return r;
      n || (n = 100), h = this.depth && 1 < s && h !== !1, i = 0;
      let p;
      h ? (p = e[0], i = 1) : 1 < s && e.sort(ba);
      for (let m, A; i < s; i++) {
        if (A = e[i], h ? (m = sa(
          this,
          r,
          o,
          n,
          l,
          s === 2,
          A,
          p
        ), o && m === !1 && r.length || (p = A)) : m = sa(this, r, o, n, l, s === 1, A), m)
          return m;
        if (o && i === s - 1) {
          if (f = r.length, !f) {
            if (h) {
              h = 0, i = -1;
              continue;
            }
            return r;
          }
          if (f === 1)
            return ta(r[0], n, l);
        }
      }
      return ma(r, n, l, o);
    };
    function sa(e, n, i, r, s, o, l, h) {
      let f = [], p = h ? e.h : e.map;
      if (e.s || (p = ua(p, l, h, e.l)), p) {
        let m = 0;
        const A = Math.min(p.length, h ? e.A : e.D);
        for (let y = 0, w = 0, g, k; y < A && !((g = p[y]) && (e.s && (g = ua(g, l, h, e.l)), s && g && o && (k = g.length, k <= s ? (s -= k, g = null) : (g = g.slice(s), s = 0)), g && (f[m++] = g, o && (w += g.length, w >= r)))); y++)
          ;
        if (m) {
          if (o)
            return ta(f, r, 0);
          n[n.length] = f;
          return;
        }
      }
      return !i && f;
    }
    function ta(e, n, i) {
      return e = e.length === 1 ? e[0] : [].concat.apply([], e), i || e.length > n ? e.slice(i, i + n) : e;
    }
    function ua(e, n, i, r) {
      return i ? (r = r && n > i, e = (e = e[r ? n : i]) && e[r ? i : n]) : e = e[n], e;
    }
    t.contain = function(e) {
      return !!this.register[e];
    }, t.update = function(e, n) {
      return this.remove(e).add(e, n);
    }, t.remove = function(e, n) {
      const i = this.register[e];
      if (i) {
        if (this.m)
          for (let r = 0, s; r < i.length; r++)
            s = i[r], s.splice(s.indexOf(e), 1);
        else
          N(this.map, e, this.D, this.s), this.depth && N(this.h, e, this.A, this.s);
        if (n || delete this.register[e], this.cache) {
          n = this.cache;
          for (let r = 0, s, o; r < n.h.length; r++)
            o = n.h[r], s = n.cache[o], s.includes(e) && (n.h.splice(r--, 1), delete n.cache[o]);
        }
      }
      return this;
    };
    function N(e, n, i, r, s) {
      let o = 0;
      if (e.constructor === Array)
        if (s)
          n = e.indexOf(n), n !== -1 ? 1 < e.length && (e.splice(n, 1), o++) : o++;
        else {
          s = Math.min(e.length, i);
          for (let l = 0, h; l < s; l++)
            (h = e[l]) && (o = N(h, n, i, r, s), r || o || delete e[l]);
        }
      else
        for (let l in e)
          (o = N(e[l], n, i, r, s)) || delete e[l];
      return o;
    }
    t.searchCache = oa, t.export = function(e, n, i, r, s) {
      let o, l;
      switch (s || (s = 0)) {
        case 0:
          if (o = "reg", this.m) {
            l = v();
            for (let h in this.register)
              l[h] = 1;
          } else
            l = this.register;
          break;
        case 1:
          o = "cfg", l = { doc: 0, opt: this.s ? 1 : 0 };
          break;
        case 2:
          o = "map", l = this.map;
          break;
        case 3:
          o = "ctx", l = this.h;
          break;
        default:
          return;
      }
      return ra(e, n || this, i, o, r, s, l), !0;
    }, t.import = function(e, n) {
      if (n)
        switch (x(n) && (n = JSON.parse(n)), e) {
          case "cfg":
            this.s = !!n.opt;
            break;
          case "reg":
            this.m = !1, this.register = n;
            break;
          case "map":
            this.map = n;
            break;
          case "ctx":
            this.h = n;
        }
    }, la(K.prototype);
    function va(e) {
      e = e.data;
      var n = self._index;
      const i = e.args;
      var r = e.task;
      switch (r) {
        case "init":
          r = e.options || {}, e = e.factory, n = r.encode, r.cache = !1, n && n.indexOf("function") === 0 && (r.encode = Function("return " + n)()), e ? (Function("return " + e)()(self), self._index = new self.FlexSearch.Index(r), delete self.FlexSearch) : self._index = new K(r);
          break;
        default:
          e = e.id, n = n[r].apply(n, i), postMessage(r === "search" ? { id: e, msg: n } : { id: e });
      }
    }
    let wa = 0;
    function O(e) {
      if (!(this instanceof O))
        return new O(e);
      var n;
      e ? D(n = e.encode) && (e.encode = n.toString()) : e = {}, (n = (self || window)._factory) && (n = n.toString());
      const i = typeof window > "u" && self.exports, r = this;
      this.o = xa(n, i, e.worker), this.h = v(), this.o && (i ? this.o.on("message", function(s) {
        r.h[s.id](s.msg), delete r.h[s.id];
      }) : this.o.onmessage = function(s) {
        s = s.data, r.h[s.id](s.msg), delete r.h[s.id];
      }, this.o.postMessage({ task: "init", factory: n, options: e }));
    }
    P("add"), P("append"), P("search"), P("update"), P("remove");
    function P(e) {
      O.prototype[e] = O.prototype[e + "Async"] = function() {
        const n = this, i = [].slice.call(arguments);
        var r = i[i.length - 1];
        let s;
        return D(r) && (s = r, i.splice(i.length - 1, 1)), r = new Promise(function(o) {
          setTimeout(function() {
            n.h[++wa] = o, n.o.postMessage({ task: e, id: wa, args: i });
          });
        }), s ? (r.then(s), this) : r;
      };
    }
    function xa(a, b, c) {
      let d;
      try {
        d = b ? eval('new (require("worker_threads")["Worker"])("../dist/node/node.js")') : a ? new Worker(URL.createObjectURL(new Blob(["onmessage=" + va.toString()], { type: "text/javascript" }))) : new Worker(x(c) ? c : "worker/worker.js", { type: "module" });
      } catch (e) {
      }
      return d;
    }
    function Q(e) {
      if (!(this instanceof Q))
        return new Q(e);
      var n = e.document || e.doc || e, i;
      this.K = [], this.h = [], this.A = [], this.register = v(), this.key = (i = n.key || n.id) && S(i, this.A) || "id", this.m = u(e.fastupdate), this.C = (i = n.store) && i !== !0 && [], this.store = i && v(), this.I = (i = n.tag) && S(i, this.A), this.l = i && v(), this.cache = (i = e.cache) && new J(i), e.cache = !1, this.o = e.worker, this.async = !1, i = v();
      let r = n.index || n.field || n;
      x(r) && (r = [r]);
      for (let s = 0, o, l; s < r.length; s++)
        o = r[s], x(o) || (l = o, o = o.field), l = C(l) ? Object.assign({}, e, l) : e, this.o && (i[o] = new O(l), i[o].o || (this.o = !1)), this.o || (i[o] = new K(l, this.register)), this.K[s] = S(o, this.A), this.h[s] = o;
      if (this.C)
        for (e = n.store, x(e) && (e = [e]), n = 0; n < e.length; n++)
          this.C[n] = S(e[n], this.A);
      this.index = i;
    }
    function S(e, n) {
      const i = e.split(":");
      let r = 0;
      for (let s = 0; s < i.length; s++)
        e = i[s], 0 <= e.indexOf("[]") && (e = e.substring(0, e.length - 2)) && (n[r] = !0), e && (i[r++] = e);
      return r < i.length && (i.length = r), 1 < r ? i : i[0];
    }
    function T(e, n) {
      if (x(n))
        e = e[n];
      else
        for (let i = 0; e && i < n.length; i++)
          e = e[n[i]];
      return e;
    }
    function U(e, n, i, r, s) {
      if (e = e[s], r === i.length - 1)
        n[s] = e;
      else if (e)
        if (e.constructor === Array)
          for (n = n[s] = Array(e.length), s = 0; s < e.length; s++)
            U(e, n, i, r, s);
        else
          n = n[s] || (n[s] = v()), s = i[++r], U(e, n, i, r, s);
    }
    function V(e, n, i, r, s, o, l, h) {
      if (e = e[l])
        if (r === n.length - 1) {
          if (e.constructor === Array) {
            if (i[r]) {
              for (n = 0; n < e.length; n++)
                s.add(o, e[n], !0, !0);
              return;
            }
            e = e.join(" ");
          }
          s.add(o, e, h, !0);
        } else if (e.constructor === Array)
          for (l = 0; l < e.length; l++)
            V(e, n, i, r, s, o, l, h);
        else
          l = n[++r], V(e, n, i, r, s, o, l, h);
    }
    t = Q.prototype, t.add = function(e, n, i) {
      if (C(e) && (n = e, e = T(n, this.key)), n && (e || e === 0)) {
        if (!i && this.register[e])
          return this.update(e, n);
        for (let r = 0, s, o; r < this.h.length; r++)
          o = this.h[r], s = this.K[r], x(s) && (s = [s]), V(n, s, this.A, 0, this.index[o], e, s[0], i);
        if (this.I) {
          let r = T(n, this.I), s = v();
          x(r) && (r = [r]);
          for (let o = 0, l, h; o < r.length; o++)
            if (l = r[o], !s[l] && (s[l] = 1, h = this.l[l] || (this.l[l] = []), !i || !h.includes(e)) && (h[h.length] = e, this.m)) {
              const f = this.register[e] || (this.register[e] = []);
              f[f.length] = h;
            }
        }
        if (this.store && (!i || !this.store[e])) {
          let r;
          if (this.C) {
            r = v();
            for (let s = 0, o; s < this.C.length; s++)
              o = this.C[s], x(o) ? r[o] = n[o] : U(n, r, o, 0, o[0]);
          }
          this.store[e] = r || n;
        }
      }
      return this;
    }, t.append = function(e, n) {
      return this.add(e, n, !0);
    }, t.update = function(e, n) {
      return this.remove(e).add(e, n);
    }, t.remove = function(e) {
      if (C(e) && (e = T(e, this.key)), this.register[e]) {
        for (var n = 0; n < this.h.length && (this.index[this.h[n]].remove(e, !this.o), !this.m); n++)
          ;
        if (this.I && !this.m)
          for (let i in this.l) {
            n = this.l[i];
            const r = n.indexOf(e);
            r !== -1 && (1 < n.length ? n.splice(r, 1) : delete this.l[i]);
          }
        this.store && delete this.store[e], delete this.register[e];
      }
      return this;
    }, t.search = function(e, n, i, r) {
      i || (!n && C(e) ? (i = e, e = "") : C(n) && (i = n, n = 0));
      let s = [], o = [], l, h, f, p, m, A, y = 0;
      if (i)
        if (i.constructor === Array)
          f = i, i = null;
        else {
          if (e = i.query || e, f = (l = i.pluck) || i.index || i.field, p = i.tag, h = this.store && i.enrich, m = i.bool === "and", n = i.limit || n || 100, A = i.offset || 0, p && (x(p) && (p = [p]), !e)) {
            for (let g = 0, k; g < p.length; g++)
              (k = ya.call(this, p[g], n, A, h)) && (s[s.length] = k, y++);
            return y ? s : [];
          }
          x(f) && (f = [f]);
        }
      f || (f = this.h), m = m && (1 < f.length || p && 1 < p.length);
      const w = !r && (this.o || this.async) && [];
      for (let g = 0, k, $, R; g < f.length; g++) {
        let j;
        if ($ = f[g], x($) || (j = $, $ = j.field, e = j.query || e, n = j.limit || n), w)
          w[g] = this.index[$].searchAsync(e, n, j || i);
        else {
          if (r ? k = r[g] : k = this.index[$].search(e, n, j || i), R = k && k.length, p && R) {
            const _ = [];
            let B = 0;
            m && (_[0] = [k]);
            for (let z = 0, H, q; z < p.length; z++)
              H = p[z], (R = (q = this.l[H]) && q.length) && (B++, _[_.length] = m ? [q] : q);
            B && (k = m ? ma(_, n || 100, A || 0) : na(k, _), R = k.length);
          }
          if (R)
            o[y] = $, s[y++] = k;
          else if (m)
            return [];
        }
      }
      if (w) {
        const g = this;
        return new Promise(function(k) {
          Promise.all(w).then(function($) {
            k(g.search(
              e,
              n,
              i,
              $
            ));
          });
        });
      }
      if (!y)
        return [];
      if (l && (!h || !this.store))
        return s[0];
      for (let g = 0, k; g < o.length; g++) {
        if (k = s[g], k.length && h && (k = za.call(this, k)), l)
          return k;
        s[g] = { field: o[g], result: k };
      }
      return s;
    };
    function ya(e, n, i, r) {
      let s = this.l[e], o = s && s.length - i;
      if (o && 0 < o)
        return (o > n || i) && (s = s.slice(i, i + n)), r && (s = za.call(this, s)), { tag: e, result: s };
    }
    function za(e) {
      const n = Array(e.length);
      for (let i = 0, r; i < e.length; i++)
        r = e[i], n[i] = { id: r, doc: this.store[r] };
      return n;
    }
    t.contain = function(e) {
      return !!this.register[e];
    }, t.get = function(e) {
      return this.store[e];
    }, t.set = function(e, n) {
      return this.store[e] = n, this;
    }, t.searchCache = oa, t.export = function(e, n, i, r, s) {
      if (s || (s = 0), r || (r = 0), r < this.h.length) {
        const o = this.h[r], l = this.index[o];
        n = this, setTimeout(function() {
          l.export(e, n, s ? o : "", r, s++) || (r++, s = 1, n.export(e, n, o, r, s));
        });
      } else {
        let o, l;
        switch (s) {
          case 1:
            o = "tag", l = this.l;
            break;
          case 2:
            o = "store", l = this.store;
            break;
          default:
            return;
        }
        ra(e, this, i, o, r, s, l);
      }
    }, t.import = function(e, n) {
      if (n)
        switch (x(n) && (n = JSON.parse(n)), e) {
          case "tag":
            this.l = n;
            break;
          case "reg":
            this.m = !1, this.register = n;
            for (let r = 0, s; r < this.h.length; r++)
              s = this.index[this.h[r]], s.register = n, s.m = !1;
            break;
          case "store":
            this.store = n;
            break;
          default:
            e = e.split(".");
            const i = e[0];
            e = e[1], i && e && this.index[i].import(e, n);
        }
    }, la(Q.prototype);
    var Ba = { encode: Aa, F: !1, G: "" };
    const Ca = [F("[àáâãäå]"), "a", F("[èéêë]"), "e", F("[ìíîï]"), "i", F("[òóôõöő]"), "o", F("[ùúûüű]"), "u", F("[ýŷÿ]"), "y", F("ñ"), "n", F("[çc]"), "k", F("ß"), "s", F(" & "), " and "];
    function Aa(e) {
      var n = e = "" + e;
      return n.normalize && (n = n.normalize("NFD").replace(ea, "")), ca.call(this, n.toLowerCase(), !e.normalize && Ca);
    }
    var Ea = { encode: Da, F: !1, G: "strict" };
    const Fa = /[^a-z0-9]+/, Ga = { b: "p", v: "f", w: "f", z: "s", x: "s", ß: "s", d: "t", n: "m", c: "k", g: "k", j: "k", q: "k", i: "e", y: "e", u: "o" };
    function Da(e) {
      e = Aa.call(this, e).join(" ");
      const n = [];
      if (e) {
        const i = e.split(Fa), r = i.length;
        for (let s = 0, o, l = 0; s < r; s++)
          if ((e = i[s]) && (!this.filter || !this.filter[e])) {
            o = e[0];
            let h = Ga[o] || o, f = h;
            for (let p = 1; p < e.length; p++) {
              o = e[p];
              const m = Ga[o] || o;
              m && m !== f && (h += m, f = m);
            }
            n[l++] = h;
          }
      }
      return n;
    }
    var Ia = { encode: Ha, F: !1, G: "" };
    const Ja = [F("ae"), "a", F("oe"), "o", F("sh"), "s", F("th"), "t", F("ph"), "f", F("pf"), "f", F("(?![aeo])h(?![aeo])"), "", F("(?!^[aeo])h(?!^[aeo])"), ""];
    function Ha(e, n) {
      return e && (e = Da.call(this, e).join(" "), 2 < e.length && (e = E(e, Ja)), n || (1 < e.length && (e = ha(e)), e && (e = e.split(" ")))), e || [];
    }
    var La = { encode: Ka, F: !1, G: "" };
    const Ma = F("(?!\\b)[aeo]");
    function Ka(e) {
      return e && (e = Ha.call(this, e, !0), 1 < e.length && (e = e.replace(Ma, "")), 1 < e.length && (e = ha(e)), e && (e = e.split(" "))), e || [];
    }
    G["latin:default"] = ja, G["latin:simple"] = Ba, G["latin:balance"] = Ea, G["latin:advanced"] = Ia, G["latin:extra"] = La;
    const W = self;
    let Y;
    const Z = { Index: K, Document: Q, Worker: O, registerCharset: function(e, n) {
      G[e] = n;
    }, registerLanguage: function(e, n) {
      ka[e] = n;
    } };
    (Y = W.define) && Y.amd ? Y([], function() {
      return Z;
    }) : W.exports ? W.exports = Z : W.FlexSearch = Z;
  })(commonjsGlobal);
})(flexsearch_bundle);
const FlexSearch = flexsearch_bundleExports, md = new MarkdownIt();
let MAX_PREVIEW_CHARS = 62;
const buildIndexSearch = (e, n) => {
  var i = new FlexSearch.Index(n);
  return e.forEach((r) => {
    i.add(r.id, r.a + " " + r.b);
  }), i;
};
function buildPreviews(e) {
  const n = {};
  for (let i = 0; i < e.length; i++) {
    const r = e[i];
    let s = md.render(r.b).replace(/(<([^>]+)>)/gi, "");
    s == "" && (s = r.b), s.length > MAX_PREVIEW_CHARS && (s = s.slice(0, MAX_PREVIEW_CHARS) + " ..."), n[r.id] = {
      t: r.t || r.a,
      p: s,
      l: r.link,
      a: r.a
    };
  }
  return n;
}
async function IndexSearch(e, n) {
  console.log("  🔎 Indexing..."), n.previewLength && (MAX_PREVIEW_CHARS = n.previewLength);
  const i = await buildDocs(e, n), r = buildPreviews(i), s = buildIndexSearch(i, n);
  var o = {
    reg: JSON.stringify(s.registry),
    cfg: JSON.stringify(s.cfg),
    map: JSON.stringify(s.map),
    ctx: JSON.stringify(s.ctx)
  };
  const l = `const INDEX_DATA = ${JSON.stringify(o)};
  const PREVIEW_LOOKUP = ${JSON.stringify(r)};
  const Options = ${JSON.stringify(n)};
  const data = { INDEX_DATA, PREVIEW_LOOKUP, Options };
  export default data;`;
  return console.log("  🔎 Done."), l;
}
const DEFAULT_OPTIONS = {
  previewLength: 62,
  buttonLabel: "Search",
  placeholder: "Search docs",
  allow: [],
  ignore: []
};
function SearchPlugin(e) {
  const n = {
    ...DEFAULT_OPTIONS,
    ...e
  };
  let i;
  const r = "virtual:search-data", s = "\0" + r;
  return {
    name: "vite-plugin-search",
    enforce: "pre",
    configResolved(o) {
      i = o;
    },
    config: () => ({
      resolve: {
        alias: { "./VPNavBarSearch.vue": "wb-vitepress-plugin-search/Search.vue" }
      }
    }),
    async resolveId(o) {
      if (o === r)
        return s;
    },
    async load(o) {
      return o !== s ? void 0 : (console.log(i.root), await IndexSearch(i.root, n));
    }
  };
}
export {
  SearchPlugin
};
