import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "./refine.png";
import refineDisabled from "./refine-1.png";
import idea from "./idea.png";
import ideaDisabled from "./idea-1.png";
import rightArrow from "./right-arrow.png";
import dupe from "./dupe.png";
import bionic from "./bionic.png";

const icons = {
    refine,
    refineDisabled,
    idea,
    ideaDisabled,
    rightArrow
}

export default function Icon(props: Partial<ImageProps> & { name: string }) {
    const src = icons[props.name] || itemIcons[props.name];
    return <Image {...props} src={src} />;
}

export const itemIcons = {
    复制人: dupe,
    仿生人: bionic,

    氧气菜单: "https://oxygennotincluded.wiki.gg/zh/images/4/44/%E6%B0%A7%E6%B0%94%E8%8F%9C%E5%8D%95.png",
    电解器: "https://oxygennotincluded.wiki.gg/zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png",
    铁锈脱氧机: "https://oxygennotincluded.wiki.gg/zh/images/2/2a/%E9%93%81%E9%94%88%E8%84%B1%E6%B0%A7%E6%9C%BA.png",
    空气净化器: "https://oxygennotincluded.wiki.gg/zh/images/b/b7/%E7%A9%BA%E6%B0%94%E5%87%80%E5%8C%96%E5%99%A8.png",
    碳素脱离器: "https://oxygennotincluded.wiki.gg/zh/images/a/aa/%E7%A2%B3%E7%B4%A0%E8%84%B1%E7%A6%BB%E5%99%A8.png",

    精炼: refine,
    脱盐器: "https://oxygennotincluded.wiki.gg/zh/images/4/45/%E8%84%B1%E7%9B%90%E5%99%A8.png",

    医疗: "https://oxygennotincluded.wiki.gg/zh/images/2/20/%E5%8C%BB%E7%96%97%E8%8F%9C%E5%8D%95.png",
    配药桌: "https://oxygennotincluded.wiki.gg/zh/images/0/0e/%E9%85%8D%E8%8D%AF%E6%A1%8C.png",

    好吃哈奇: "https://oxygennotincluded.wiki.gg/zh/images/f/f6/%E5%A5%BD%E5%90%83%E5%93%88%E5%A5%87.png",
    草质哈奇: "https://oxygennotincluded.wiki.gg/zh/images/3/32/%E8%8D%89%E8%B4%A8%E5%93%88%E5%A5%87.png",
    石壳哈奇: "https://oxygennotincluded.wiki.gg/zh/images/f/f6/%E7%9F%B3%E5%A3%B3%E5%93%88%E5%A5%87.png",
    霸王鹦: "https://oxygennotincluded.wiki.gg/zh/images/d/d5/%E9%9C%B8%E7%8E%8B%E9%B9%A6.png",
    肉: "https://oxygennotincluded.wiki.gg/zh/images/8/88/%E8%82%89.png",
    硬肉: "https://oxygennotincluded.wiki.gg/zh/images/f/f2/%E7%A1%AC%E8%82%89.png",

    磷矿: "https://oxygennotincluded.wiki.gg/zh/images/0/0c/%E7%A3%B7%E7%9F%BF.png",
    肥料: "https://oxygennotincluded.wiki.gg/zh/images/f/fe/%E8%82%A5%E6%96%99.png",
    碎岩: "https://oxygennotincluded.wiki.gg/zh/images/2/2a/%E7%A2%8E%E5%B2%A9.png",
    化石: "https://oxygennotincluded.wiki.gg/zh/images/3/3b/%E5%8C%96%E7%9F%B3.png",
    沉积岩:
        "https://oxygennotincluded.wiki.gg/zh/images/8/89/%E6%B2%89%E7%A7%AF%E5%B2%A9.png",
    火成岩:
        "https://oxygennotincluded.wiki.gg/zh/images/c/c2/%E7%81%AB%E6%88%90%E5%B2%A9.png",
    石墨: "https://oxygennotincluded.wiki.gg/zh/images/4/48/%E7%9F%B3%E5%A2%A8.png",
    砂岩: "https://oxygennotincluded.wiki.gg/zh/images/2/2a/%E7%A0%82%E5%B2%A9.png",
    花岗岩:
        "https://oxygennotincluded.wiki.gg/zh/images/b/bc/%E8%8A%B1%E5%B2%97%E5%B2%A9.png",
    镁铁质岩:
        "https://oxygennotincluded.wiki.gg/zh/images/7/78/%E9%95%81%E9%93%81%E8%B4%A8%E5%B2%A9.png",
    陶瓷: "https://oxygennotincluded.wiki.gg/zh/images/4/45/%E9%99%B6%E7%93%B7.png",
    页岩: "https://oxygennotincluded.wiki.gg/zh/images/e/ef/%E9%A1%B5%E5%B2%A9.png",
    黑曜石:
        "https://oxygennotincluded.wiki.gg/zh/images/0/00/%E9%BB%91%E6%9B%9C%E7%9F%B3.png",
    咸乳蜡:
        "https://oxygennotincluded.wiki.gg/zh/images/c/c1/%E5%92%B8%E4%B9%B3%E8%9C%A1.png",
    固态甲烷:
        "https://oxygennotincluded.wiki.gg/zh/images/1/11/%E5%9B%BA%E6%80%81%E7%94%B2%E7%83%B7.png",
    泥炭: "https://oxygennotincluded.wiki.gg/zh/images/3/34/%E6%B3%A5%E7%82%AD.png",
    煤炭: "https://oxygennotincluded.wiki.gg/zh/images/c/c1/%E7%85%A4%E7%82%AD.png",
    盐: "https://oxygennotincluded.wiki.gg/zh/images/1/1d/%E7%9B%90.png",
    石灰: "https://oxygennotincluded.wiki.gg/zh/images/b/b2/%E7%9F%B3%E7%81%B0.png",
    精炼碳:
        "https://oxygennotincluded.wiki.gg/zh/images/d/d0/%E7%B2%BE%E7%82%BC%E7%A2%B3.png",
    精炼磷:
        "https://oxygennotincluded.wiki.gg/zh/images/0/02/%E7%B2%BE%E7%82%BC%E7%A3%B7.png",
    蔗糖: "https://oxygennotincluded.wiki.gg/zh/images/c/c2/%E8%94%97%E7%B3%96.png",
    铁锈: "https://oxygennotincluded.wiki.gg/zh/images/7/76/%E9%93%81%E9%94%88.png",
    泥土: "https://oxygennotincluded.wiki.gg/zh/images/3/3b/%E6%B3%A5%E5%9C%9F.png",
    粘土: "https://oxygennotincluded.wiki.gg/zh/images/e/ef/%E7%B2%98%E5%9C%9F.png",
    沙子: "https://oxygennotincluded.wiki.gg/zh/images/1/12/%E6%B2%99%E5%AD%90.png",
    浮土: "https://oxygennotincluded.wiki.gg/zh/images/1/10/%E6%B5%AE%E5%9C%9F.png",
    冰: "https://oxygennotincluded.wiki.gg/zh/images/e/eb/%E5%86%B0.png",
    凝冻咸乳:
        "https://oxygennotincluded.wiki.gg/zh/images/4/48/%E5%87%9D%E5%86%BB%E5%92%B8%E4%B9%B3.png",
    凝冻植物润滑油:
        "https://oxygennotincluded.wiki.gg/zh/images/3/31/%E5%87%9D%E5%86%BB%E6%A4%8D%E7%89%A9%E6%B6%A6%E6%BB%91%E6%B2%B9.png",
    动物油脂:
        "https://oxygennotincluded.wiki.gg/zh/images/a/ac/%E5%8A%A8%E7%89%A9%E6%B2%B9%E8%84%82.png",
    固态丙烷:
        "https://oxygennotincluded.wiki.gg/zh/images/7/76/%E5%9B%BA%E6%80%81%E4%B8%99%E7%83%B7.png",
    固态乙醇:
        "https://oxygennotincluded.wiki.gg/zh/images/8/8f/%E5%9B%BA%E6%80%81%E4%B9%99%E9%86%87.png",
    固态二氧化碳:
        "https://oxygennotincluded.wiki.gg/zh/images/2/2d/%E5%9B%BA%E6%80%81%E4%BA%8C%E6%B0%A7%E5%8C%96%E7%A2%B3.png",
    固态原油:
        "https://oxygennotincluded.wiki.gg/zh/images/a/af/%E5%9B%BA%E6%80%81%E5%8E%9F%E6%B2%B9.png",
    固态氢:
        "https://oxygennotincluded.wiki.gg/zh/images/2/24/%E5%9B%BA%E6%80%81%E6%B0%A2.png",
    固态氧:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f0/%E5%9B%BA%E6%80%81%E6%B0%A7.png",
    固态氯:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f9/%E5%9B%BA%E6%80%81%E6%B0%AF.png",
    固态石油:
        "https://oxygennotincluded.wiki.gg/zh/images/4/4f/%E5%9B%BA%E6%80%81%E7%9F%B3%E6%B2%B9.png",
    固态石脑油:
        "https://oxygennotincluded.wiki.gg/zh/images/1/14/%E5%9B%BA%E6%80%81%E7%9F%B3%E8%84%91%E6%B2%B9.png",
    污染冰:
        "https://oxygennotincluded.wiki.gg/zh/images/f/fe/%E6%B1%A1%E6%9F%93%E5%86%B0.png",
    浓盐冰:
        "https://oxygennotincluded.wiki.gg/zh/images/e/e6/%E6%B5%93%E7%9B%90%E5%86%B0.png",
    碎冰: "https://oxygennotincluded.wiki.gg/zh/images/4/47/%E7%A2%8E%E5%86%B0.png",
    紧压雪:
        "https://oxygennotincluded.wiki.gg/zh/images/c/c4/%E7%B4%A7%E5%8E%8B%E9%9B%AA.png",
    雪: "https://oxygennotincluded.wiki.gg/zh/images/c/c4/%E9%9B%AA.png",
    固态粘性凝胶:
        "https://oxygennotincluded.wiki.gg/zh/images/e/e8/%E5%9B%BA%E6%80%81%E7%B2%98%E6%80%A7%E5%87%9D%E8%83%B6.png",
    固态超级冷却剂:
        "https://oxygennotincluded.wiki.gg/zh/images/6/6f/%E5%9B%BA%E6%80%81%E8%B6%85%E7%BA%A7%E5%86%B7%E5%8D%B4%E5%89%82.png",
    塑料: "https://oxygennotincluded.wiki.gg/zh/images/8/83/%E5%A1%91%E6%96%99.png",
    塑料质:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f0/%E5%A1%91%E6%96%99%E8%B4%A8.png",
    导热质:
        "https://oxygennotincluded.wiki.gg/zh/images/7/76/%E5%AF%BC%E7%83%AD%E8%B4%A8.png",
    浓缩铀:
        "https://oxygennotincluded.wiki.gg/zh/images/0/04/%E6%B5%93%E7%BC%A9%E9%93%80.png",
    玻璃: "https://oxygennotincluded.wiki.gg/zh/images/0/04/%E7%8E%BB%E7%92%83.png",
    钢: "https://oxygennotincluded.wiki.gg/zh/images/8/86/%E9%92%A2.png",
    隔热质:
        "https://oxygennotincluded.wiki.gg/zh/images/7/78/%E9%9A%94%E7%83%AD%E8%B4%A8.png",
    朱砂矿:
        "https://oxygennotincluded.wiki.gg/zh/images/a/a8/%E6%9C%B1%E7%A0%82%E7%9F%BF.png",
    金汞齐:
        "https://oxygennotincluded.wiki.gg/zh/images/1/1a/%E9%87%91%E6%B1%9E%E9%BD%90.png",
    钴矿: "https://oxygennotincluded.wiki.gg/zh/images/c/c8/%E9%92%B4%E7%9F%BF.png",
    铀矿: "https://oxygennotincluded.wiki.gg/zh/images/9/96/%E9%93%80%E7%9F%BF.png",
    铁矿: "https://oxygennotincluded.wiki.gg/zh/images/5/57/%E9%93%81%E7%9F%BF.png",
    铜矿: "https://oxygennotincluded.wiki.gg/zh/images/f/f8/%E9%93%9C%E7%9F%BF.png",
    铝矿: "https://oxygennotincluded.wiki.gg/zh/images/a/a0/%E9%93%9D%E7%9F%BF.png",
    镍矿: "https://oxygennotincluded.wiki.gg/zh/images/7/72/%E9%95%8D%E7%9F%BF.png",
    黄铁矿:
        "https://oxygennotincluded.wiki.gg/zh/images/3/35/%E9%BB%84%E9%93%81%E7%9F%BF.png",
    黑钨矿:
        "https://oxygennotincluded.wiki.gg/zh/images/9/98/%E9%BB%91%E9%92%A8%E7%9F%BF.png",
    固态树液:
        "https://oxygennotincluded.wiki.gg/zh/images/8/86/%E5%9B%BA%E6%80%81%E6%A0%91%E6%B6%B2.png",
    固态树脂:
        "https://oxygennotincluded.wiki.gg/zh/images/5/54/%E5%9B%BA%E6%80%81%E6%A0%91%E8%84%82.png",
    固态粘渣油:
        "https://oxygennotincluded.wiki.gg/zh/images/2/24/%E5%9B%BA%E6%80%81%E7%B2%98%E6%B8%A3%E6%B2%B9.png",
    木材: "https://oxygennotincluded.wiki.gg/zh/images/8/84/%E6%9C%A8%E6%9D%90.png",
    污染土:
        "https://oxygennotincluded.wiki.gg/zh/images/0/02/%E6%B1%A1%E6%9F%93%E5%9C%9F.png",
    污染泥:
        "https://oxygennotincluded.wiki.gg/zh/images/a/ac/%E6%B1%A1%E6%9F%93%E6%B3%A5.png",
    泥巴: "https://oxygennotincluded.wiki.gg/zh/images/3/3c/%E6%B3%A5%E5%B7%B4.png",
    琥珀: "https://oxygennotincluded.wiki.gg/zh/images/e/ea/%E7%90%A5%E7%8F%80.png",
    菌泥: "https://oxygennotincluded.wiki.gg/zh/images/0/0e/%E8%8F%8C%E6%B3%A5.png",
    藻类: "https://oxygennotincluded.wiki.gg/zh/images/f/f9/%E8%97%BB%E7%B1%BB.png",
    固态核废料:
        "https://oxygennotincluded.wiki.gg/zh/images/7/79/%E5%9B%BA%E6%80%81%E6%A0%B8%E5%BA%9F%E6%96%99.png",
    堆芯熔融物:
        "https://oxygennotincluded.wiki.gg/zh/images/5/5c/%E5%A0%86%E8%8A%AF%E7%86%94%E8%9E%8D%E7%89%A9.png",
    深渊晶石:
        "https://oxygennotincluded.wiki.gg/zh/images/e/eb/%E6%B7%B1%E6%B8%8A%E6%99%B6%E7%9F%B3.png",
    硫: "https://oxygennotincluded.wiki.gg/zh/images/5/5a/%E7%A1%AB.png",
    钻石: "https://oxygennotincluded.wiki.gg/zh/images/8/8a/%E9%92%BB%E7%9F%B3.png",
    富勒烯:
        "https://oxygennotincluded.wiki.gg/zh/images/3/37/%E5%AF%8C%E5%8B%92%E7%83%AF.png",
    异构树液:
        "https://oxygennotincluded.wiki.gg/zh/images/8/8b/%E5%BC%82%E6%9E%84%E6%A0%91%E6%B6%B2.png",
    铌: "https://oxygennotincluded.wiki.gg/zh/images/9/94/%E9%93%8C.png",
    固态汞:
        "https://oxygennotincluded.wiki.gg/zh/images/c/cf/%E5%9B%BA%E6%80%81%E6%B1%9E.png",
    贫铀: "https://oxygennotincluded.wiki.gg/zh/images/1/15/%E8%B4%AB%E9%93%80.png",
    金: "https://oxygennotincluded.wiki.gg/zh/images/a/a6/%E9%87%91.png",
    钨: "https://oxygennotincluded.wiki.gg/zh/images/5/5c/%E9%92%A8.png",
    钴: "https://oxygennotincluded.wiki.gg/zh/images/5/50/%E9%92%B4.png",
    铁: "https://oxygennotincluded.wiki.gg/zh/images/b/b8/%E9%93%81.png",
    铅: "https://oxygennotincluded.wiki.gg/zh/images/7/7a/%E9%93%85.png",
    铜: "https://oxygennotincluded.wiki.gg/zh/images/4/43/%E9%93%9C.png",
    铝: "https://oxygennotincluded.wiki.gg/zh/images/f/f4/%E9%93%9D.png",
    铱: "https://oxygennotincluded.wiki.gg/zh/images/6/6c/%E9%93%B1.png",
    镍: "https://oxygennotincluded.wiki.gg/zh/images/0/0b/%E9%95%8D.png",
    中子质:
        "https://oxygennotincluded.wiki.gg/zh/images/d/df/%E4%B8%AD%E5%AD%90%E8%B4%A8.png",
    氧石: "https://oxygennotincluded.wiki.gg/zh/images/c/ca/%E6%B0%A7%E7%9F%B3.png",
    漂白石:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f1/%E6%BC%82%E7%99%BD%E7%9F%B3.png",
    沥青: "https://oxygennotincluded.wiki.gg/zh/images/1/15/%E6%B2%A5%E9%9D%92.png",
    遗传生物软泥:
        "https://oxygennotincluded.wiki.gg/zh/images/e/ee/%E9%81%97%E4%BC%A0%E7%94%9F%E7%89%A9%E8%BD%AF%E6%B3%A5.png",
    镭: "https://oxygennotincluded.wiki.gg/zh/images/7/72/%E9%95%AD.png",
    乙醇: "https://oxygennotincluded.wiki.gg/zh/images/d/d8/%E4%B9%99%E9%86%87.png",
    原油: "https://oxygennotincluded.wiki.gg/zh/images/d/db/%E5%8E%9F%E6%B2%B9.png",
    咸乳: "https://oxygennotincluded.wiki.gg/zh/images/7/7d/%E5%92%B8%E4%B9%B3.png",
    岩浆: "https://oxygennotincluded.wiki.gg/zh/images/3/38/%E5%B2%A9%E6%B5%86.png",
    树液: "https://oxygennotincluded.wiki.gg/zh/images/8/8c/%E6%A0%91%E6%B6%B2.png",
    树脂: "https://oxygennotincluded.wiki.gg/zh/images/9/97/%E6%A0%91%E8%84%82.png",
    植物润滑油:
        "https://oxygennotincluded.wiki.gg/zh/images/6/66/%E6%A4%8D%E7%89%A9%E6%B6%A6%E6%BB%91%E6%B2%B9.png",
    水: "https://oxygennotincluded.wiki.gg/zh/images/a/a9/%E6%B0%B4.png",
    汞: "https://oxygennotincluded.wiki.gg/zh/images/e/e4/%E6%B1%9E.png",
    污染水:
        "https://oxygennotincluded.wiki.gg/zh/images/c/cd/%E6%B1%A1%E6%9F%93%E6%B0%B4.png",
    浓盐水:
        "https://oxygennotincluded.wiki.gg/zh/images/d/d9/%E6%B5%93%E7%9B%90%E6%B0%B4.png",
    液态丙烷:
        "https://oxygennotincluded.wiki.gg/zh/images/2/26/%E6%B6%B2%E6%80%81%E4%B8%99%E7%83%B7.png",
    液态二氧化碳:
        "https://oxygennotincluded.wiki.gg/zh/images/5/51/%E6%B6%B2%E6%80%81%E4%BA%8C%E6%B0%A7%E5%8C%96%E7%A2%B3.png",
    液态核废料:
        "https://oxygennotincluded.wiki.gg/zh/images/0/0e/%E6%B6%B2%E6%80%81%E6%A0%B8%E5%BA%9F%E6%96%99.png",
    液态氢:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f4/%E6%B6%B2%E6%80%81%E6%B0%A2.png",
    液态氧:
        "https://oxygennotincluded.wiki.gg/zh/images/8/8c/%E6%B6%B2%E6%80%81%E6%B0%A7.png",
    液态氯:
        "https://oxygennotincluded.wiki.gg/zh/images/3/3e/%E6%B6%B2%E6%80%81%E6%B0%AF.png",
    液态甲烷:
        "https://oxygennotincluded.wiki.gg/zh/images/d/d5/%E6%B6%B2%E6%80%81%E7%94%B2%E7%83%B7.png",
    液态石脑油:
        "https://oxygennotincluded.wiki.gg/zh/images/8/81/%E6%B6%B2%E6%80%81%E7%9F%B3%E8%84%91%E6%B2%B9.png",
    液态硫:
        "https://oxygennotincluded.wiki.gg/zh/images/8/83/%E6%B6%B2%E6%80%81%E7%A1%AB.png",
    液态磷:
        "https://oxygennotincluded.wiki.gg/zh/images/e/ed/%E6%B6%B2%E6%80%81%E7%A3%B7.png",
    熔融玻璃:
        "https://oxygennotincluded.wiki.gg/zh/images/6/63/%E7%86%94%E8%9E%8D%E7%8E%BB%E7%92%83.png",
    熔融盐:
        "https://oxygennotincluded.wiki.gg/zh/images/d/df/%E7%86%94%E8%9E%8D%E7%9B%90.png",
    熔融碳:
        "https://oxygennotincluded.wiki.gg/zh/images/6/64/%E7%86%94%E8%9E%8D%E7%A2%B3.png",
    熔融蔗糖:
        "https://oxygennotincluded.wiki.gg/zh/images/d/d4/%E7%86%94%E8%9E%8D%E8%94%97%E7%B3%96.png",
    熔融金:
        "https://oxygennotincluded.wiki.gg/zh/images/8/8a/%E7%86%94%E8%9E%8D%E9%87%91.png",
    熔融钢:
        "https://oxygennotincluded.wiki.gg/zh/images/1/1a/%E7%86%94%E8%9E%8D%E9%92%A2.png",
    熔融钨:
        "https://oxygennotincluded.wiki.gg/zh/images/4/4a/%E7%86%94%E8%9E%8D%E9%92%A8.png",
    熔融钴:
        "https://oxygennotincluded.wiki.gg/zh/images/c/c8/%E7%86%94%E8%9E%8D%E9%92%B4.png",
    熔融铀:
        "https://oxygennotincluded.wiki.gg/zh/images/e/e0/%E7%86%94%E8%9E%8D%E9%93%80.png",
    熔融铁:
        "https://oxygennotincluded.wiki.gg/zh/images/e/ef/%E7%86%94%E8%9E%8D%E9%93%81.png",
    熔融铅:
        "https://oxygennotincluded.wiki.gg/zh/images/1/15/%E7%86%94%E8%9E%8D%E9%93%85.png",
    熔融铌:
        "https://oxygennotincluded.wiki.gg/zh/images/5/50/%E7%86%94%E8%9E%8D%E9%93%8C.png",
    熔融铜:
        "https://oxygennotincluded.wiki.gg/zh/images/5/59/%E7%86%94%E8%9E%8D%E9%93%9C.png",
    熔融铝:
        "https://oxygennotincluded.wiki.gg/zh/images/f/f9/%E7%86%94%E8%9E%8D%E9%93%9D.png",
    熔融铱:
        "https://oxygennotincluded.wiki.gg/zh/images/a/a7/%E7%86%94%E8%9E%8D%E9%93%B1.png",
    熔融镍:
        "https://oxygennotincluded.wiki.gg/zh/images/a/a9/%E7%86%94%E8%9E%8D%E9%95%8D.png",
    生物柴油:
        "https://oxygennotincluded.wiki.gg/zh/images/3/32/%E7%94%9F%E7%89%A9%E6%9F%B4%E6%B2%B9.png",
    盐水: "https://oxygennotincluded.wiki.gg/zh/images/d/d7/%E7%9B%90%E6%B0%B4.png",
    石油: "https://oxygennotincluded.wiki.gg/zh/images/b/b1/%E7%9F%B3%E6%B2%B9.png",
    粘性凝胶流体:
        "https://oxygennotincluded.wiki.gg/zh/images/d/df/%E7%B2%98%E6%80%A7%E5%87%9D%E8%83%B6%E6%B5%81%E4%BD%93.png",
    粘渣油:
        "https://oxygennotincluded.wiki.gg/zh/images/4/4a/%E7%B2%98%E6%B8%A3%E6%B2%B9.png",
    花蜜: "https://oxygennotincluded.wiki.gg/zh/images/1/1d/%E8%8A%B1%E8%9C%9C.png",
    超级冷却剂:
        "https://oxygennotincluded.wiki.gg/zh/images/d/d3/%E8%B6%85%E7%BA%A7%E5%86%B7%E5%8D%B4%E5%89%82.png",
    氧气: "https://oxygennotincluded.wiki.gg/zh/images/f/f9/%E6%B0%A7%E6%B0%94.png",
    污染氧:
        "https://oxygennotincluded.wiki.gg/zh/images/c/ce/%E6%B1%A1%E6%9F%93%E6%B0%A7.png",
    二氧化碳:
        "https://oxygennotincluded.wiki.gg/zh/images/e/e9/%E4%BA%8C%E6%B0%A7%E5%8C%96%E7%A2%B3.png",
    天然气:
        "https://oxygennotincluded.wiki.gg/zh/images/a/ac/%E5%A4%A9%E7%84%B6%E6%B0%94.png",
    核尘埃:
        "https://oxygennotincluded.wiki.gg/zh/images/a/a2/%E6%A0%B8%E5%B0%98%E5%9F%83.png",
    气态乙醇:
        "https://oxygennotincluded.wiki.gg/zh/images/e/e5/%E6%B0%94%E6%80%81%E4%B9%99%E9%86%87.png",
    气态岩:
        "https://oxygennotincluded.wiki.gg/zh/images/5/5f/%E6%B0%94%E6%80%81%E5%B2%A9.png",
    气态盐:
        "https://oxygennotincluded.wiki.gg/zh/images/8/80/%E6%B0%94%E6%80%81%E7%9B%90.png",
    气态碳:
        "https://oxygennotincluded.wiki.gg/zh/images/a/a2/%E6%B0%94%E6%80%81%E7%A2%B3.png",
    气态磷:
        "https://oxygennotincluded.wiki.gg/zh/images/1/1e/%E6%B0%94%E6%80%81%E7%A3%B7.png",
    气态超级冷却剂:
        "https://oxygennotincluded.wiki.gg/zh/images/8/8e/%E6%B0%94%E6%80%81%E8%B6%85%E7%BA%A7%E5%86%B7%E5%8D%B4%E5%89%82.png",
    气态金:
        "https://oxygennotincluded.wiki.gg/zh/images/3/38/%E6%B0%94%E6%80%81%E9%87%91.png",
    气态钢:
        "https://oxygennotincluded.wiki.gg/zh/images/c/c3/%E6%B0%94%E6%80%81%E9%92%A2.png",
    气态钨:
        "https://oxygennotincluded.wiki.gg/zh/images/4/45/%E6%B0%94%E6%80%81%E9%92%A8.png",
    气态钴:
        "https://oxygennotincluded.wiki.gg/zh/images/2/21/%E6%B0%94%E6%80%81%E9%92%B4.png",
    气态铁:
        "https://oxygennotincluded.wiki.gg/zh/images/c/cd/%E6%B0%94%E6%80%81%E9%93%81.png",
    气态铅:
        "https://oxygennotincluded.wiki.gg/zh/images/7/76/%E6%B0%94%E6%80%81%E9%93%85.png",
    气态铌:
        "https://oxygennotincluded.wiki.gg/zh/images/8/81/%E6%B0%94%E6%80%81%E9%93%8C.png",
    气态铜:
        "https://oxygennotincluded.wiki.gg/zh/images/b/bd/%E6%B0%94%E6%80%81%E9%93%9C.png",
    气态铝:
        "https://oxygennotincluded.wiki.gg/zh/images/b/b3/%E6%B0%94%E6%80%81%E9%93%9D.png",
    气态铱:
        "https://oxygennotincluded.wiki.gg/zh/images/3/33/%E6%B0%94%E6%80%81%E9%93%B1.png",
    气态镍:
        "https://oxygennotincluded.wiki.gg/zh/images/7/72/%E6%B0%94%E6%80%81%E9%95%8D.png",
    氢气: "https://oxygennotincluded.wiki.gg/zh/images/0/09/%E6%B0%A2%E6%B0%94.png",
    氯气: "https://oxygennotincluded.wiki.gg/zh/images/c/cc/%E6%B0%AF%E6%B0%94.png",
    汞蒸气:
        "https://oxygennotincluded.wiki.gg/zh/images/d/dc/%E6%B1%9E%E8%92%B8%E6%B0%94.png",
    硫蒸气:
        "https://oxygennotincluded.wiki.gg/zh/images/0/0c/%E7%A1%AB%E8%92%B8%E6%B0%94.png",
    蒸汽: "https://oxygennotincluded.wiki.gg/zh/images/b/b4/%E8%92%B8%E6%B1%BD.png",
    高硫天然气:
        "https://oxygennotincluded.wiki.gg/zh/images/c/cb/%E9%AB%98%E7%A1%AB%E5%A4%A9%E7%84%B6%E6%B0%94.png",
    真空: "https://oxygennotincluded.wiki.gg/zh/images/5/5f/%E7%9C%9F%E7%A9%BA.png",
    虚空: "https://oxygennotincluded.wiki.gg/zh/images/9/99/%E8%99%9A%E7%A9%BA.png",
    齿轮膏:
        "https://oxygennotincluded.wiki.gg/zh/images/2/2c/%E9%BD%BF%E8%BD%AE%E8%86%8F.png",
};