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
    氧气扩散器: "https://oxygennotincluded.wiki.gg/zh/images/thumb/4/4a/%E6%B0%A7%E6%B0%94%E6%89%A9%E6%95%A3%E5%99%A8.png/100px-%E6%B0%A7%E6%B0%94%E6%89%A9%E6%95%A3%E5%99%A8.png",
    电解器: "https://oxygennotincluded.wiki.gg/zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png",
    升华站: "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/f8/%E5%8D%87%E5%8D%8E%E7%AB%99.png/100px-%E5%8D%87%E5%8D%8E%E7%AB%99.png",
    铁锈脱氧机: "https://oxygennotincluded.wiki.gg/zh/images/2/2a/%E9%93%81%E9%94%88%E8%84%B1%E6%B0%A7%E6%9C%BA.png",
    空气净化器: "https://oxygennotincluded.wiki.gg/zh/images/b/b7/%E7%A9%BA%E6%B0%94%E5%87%80%E5%8C%96%E5%99%A8.png",
    碳素脱离器: "https://oxygennotincluded.wiki.gg/zh/images/a/aa/%E7%A2%B3%E7%B4%A0%E8%84%B1%E7%A6%BB%E5%99%A8.png",
    藻类箱: "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/e2/%E8%97%BB%E7%B1%BB%E7%AE%B1.png/100px-%E8%97%BB%E7%B1%BB%E7%AE%B1.png",

    电力: "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/1e/%E7%94%B5%E5%8A%9B%E8%8F%9C%E5%8D%95.png/34px-%E7%94%B5%E5%8A%9B%E8%8F%9C%E5%8D%95.png",
    煤炭发电机: "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/1d/%E7%85%A4%E7%82%AD%E5%8F%91%E7%94%B5%E6%9C%BA.png/100px-%E7%85%A4%E7%82%AD%E5%8F%91%E7%94%B5%E6%9C%BA.png",
    木材燃烧器: "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/93/%E6%9C%A8%E6%9D%90%E7%87%83%E7%83%A7%E5%99%A8.png/100px-%E6%9C%A8%E6%9D%90%E7%87%83%E7%83%A7%E5%99%A8.png",
    泥炭燃烧器: "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/c9/%E6%B3%A5%E7%82%AD%E7%87%83%E7%83%A7%E5%99%A8.png/100px-%E6%B3%A5%E7%82%AD%E7%87%83%E7%83%A7%E5%99%A8.png",
    氢气发电机: "https://oxygennotincluded.wiki.gg/zh/images/thumb/b/ba/%E6%B0%A2%E6%B0%94%E5%8F%91%E7%94%B5%E6%9C%BA.png/100px-%E6%B0%A2%E6%B0%94%E5%8F%91%E7%94%B5%E6%9C%BA.png",
    天然气发电机: "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/53/%E5%A4%A9%E7%84%B6%E6%B0%94%E5%8F%91%E7%94%B5%E6%9C%BA.png/100px-%E5%A4%A9%E7%84%B6%E6%B0%94%E5%8F%91%E7%94%B5%E6%9C%BA.png",
    石油发电机: "https://oxygennotincluded.wiki.gg/zh/images/thumb/0/04/%E7%9F%B3%E6%B2%B9%E5%8F%91%E7%94%B5%E6%9C%BA.png/100px-%E7%9F%B3%E6%B2%B9%E5%8F%91%E7%94%B5%E6%9C%BA.png",

    食物: "https://oxygennotincluded.wiki.gg/zh/images/thumb/2/20/%E9%A3%9F%E7%89%A9%E8%8F%9C%E5%8D%95.png/48px-%E9%A3%9F%E7%89%A9%E8%8F%9C%E5%8D%95.png",
    电动烤炉: "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/8c/%E7%94%B5%E5%8A%A8%E7%83%A4%E7%82%89.png/100px-%E7%94%B5%E5%8A%A8%E7%83%A4%E7%82%89.png",
    油炸锅: "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/1f/%E6%B2%B9%E7%82%B8%E9%94%85.png/100px-%E6%B2%B9%E7%82%B8%E9%94%85.png",
    食物压制器: "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/c6/%E9%A3%9F%E7%89%A9%E5%8E%8B%E5%88%B6%E5%99%A8.png/100px-%E9%A3%9F%E7%89%A9%E5%8E%8B%E5%88%B6%E5%99%A8.png",
    燃气灶: "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/37/%E7%87%83%E6%B0%94%E7%81%B6.png/100px-%E7%87%83%E6%B0%94%E7%81%B6.png",
    熏炉: "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/d2/%E7%86%8F%E7%82%89.png/100px-%E7%86%8F%E7%82%89.png",

    精炼: refine,
    碎石机: "https://oxygennotincluded.wiki.gg/images/e/e0/Rock_Crusher.png",
    脱盐器: "https://oxygennotincluded.wiki.gg/zh/images/4/45/%E8%84%B1%E7%9B%90%E5%99%A8.png",

    医疗: "https://oxygennotincluded.wiki.gg/zh/images/2/20/%E5%8C%BB%E7%96%97%E8%8F%9C%E5%8D%95.png",
    配药桌: "https://oxygennotincluded.wiki.gg/zh/images/0/0e/%E9%85%8D%E8%8D%AF%E6%A1%8C.png",

    好吃哈奇: "https://oxygennotincluded.wiki.gg/zh/images/f/f6/%E5%A5%BD%E5%90%83%E5%93%88%E5%A5%87.png",
    草质哈奇: "https://oxygennotincluded.wiki.gg/zh/images/3/32/%E8%8D%89%E8%B4%A8%E5%93%88%E5%A5%87.png",
    石壳哈奇: "https://oxygennotincluded.wiki.gg/zh/images/f/f6/%E7%9F%B3%E5%A3%B3%E5%93%88%E5%A5%87.png",
    霸王鹦: "https://oxygennotincluded.wiki.gg/zh/images/d/d5/%E9%9C%B8%E7%8E%8B%E9%B9%A6.png",
    硬肉: "https://oxygennotincluded.wiki.gg/zh/images/f/f2/%E7%A1%AC%E8%82%89.png",

    挥发: "https://oxygennotincluded.wiki.gg/zh/images/c/ce/%E6%B1%A1%E6%9F%93%E6%B0%A7.png",
    融化: "https://oxygennotincluded.wiki.gg/zh/images/a/a9/%E6%B0%B4.png",

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

    "软泥膏": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/77/%E8%BD%AF%E6%B3%A5%E8%86%8F.png/51px-%E8%BD%AF%E6%B3%A5%E8%86%8F.png",
    "米虱": "https://oxygennotincluded.wiki.gg/zh/images/thumb/2/2f/%E7%B1%B3%E8%99%B1.png/51px-%E7%B1%B3%E8%99%B1.png",
    "肉": "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/88/%E8%82%89.png/39px-%E8%82%89.png",
    "腌制米虱": "https://oxygennotincluded.wiki.gg/zh/images/thumb/2/25/%E8%85%8C%E5%88%B6%E7%B1%B3%E8%99%B1.png/30px-%E8%85%8C%E5%88%B6%E7%B1%B3%E8%99%B1.png",
    "蘑菇": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/3b/%E8%98%91%E8%8F%87.png/45px-%E8%98%91%E8%8F%87.png",
    "煎泥膏": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/fc/%E7%85%8E%E6%B3%A5%E8%86%8F.png/51px-%E7%85%8E%E6%B3%A5%E8%86%8F.png",
    "米虱糕": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/7f/%E7%B1%B3%E8%99%B1%E7%B3%95.png/51px-%E7%B1%B3%E8%99%B1%E7%B3%95.png",
    "毛刺浆果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/90/%E6%AF%9B%E5%88%BA%E6%B5%86%E6%9E%9C.png/26px-%E6%AF%9B%E5%88%BA%E6%B5%86%E6%9E%9C.png",
    "海生菜": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/9c/%E6%B5%B7%E7%94%9F%E8%8F%9C.png/40px-%E6%B5%B7%E7%94%9F%E8%8F%9C.png",
    "炙烤刺果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/c6/%E7%82%99%E7%83%A4%E5%88%BA%E6%9E%9C.png/29px-%E7%82%99%E7%83%A4%E5%88%BA%E6%9E%9C.png",
    "煎蘑菇": "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/87/%E7%85%8E%E8%98%91%E8%8F%87.png/43px-%E7%85%8E%E8%98%91%E8%8F%87.png",
    "帕库鱼片": "https://oxygennotincluded.wiki.gg/zh/images/thumb/b/b0/%E5%B8%95%E5%BA%93%E9%B1%BC%E7%89%87.png/43px-%E5%B8%95%E5%BA%93%E9%B1%BC%E7%89%87.png",
    "生蟹肉": "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/19/%E7%94%9F%E8%9F%B9%E8%82%89.png/50px-%E7%94%9F%E8%9F%B9%E8%82%89.png",
    "煎蛋卷": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/fc/%E7%85%8E%E8%9B%8B%E5%8D%B7.png/57px-%E7%85%8E%E8%9B%8B%E5%8D%B7.png",
    "生蛋": "https://oxygennotincluded.wiki.gg/zh/images/thumb/0/0a/%E7%94%9F%E8%9B%8B.png/52px-%E7%94%9F%E8%9B%8B.png",
    "冰霜面包": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/9c/%E5%86%B0%E9%9C%9C%E9%9D%A2%E5%8C%85.png/34px-%E5%86%B0%E9%9C%9C%E9%9D%A2%E5%8C%85.png",
    "豆腐": "https://oxygennotincluded.wiki.gg/zh/images/thumb/6/61/%E8%B1%86%E8%85%90.png/54px-%E8%B1%86%E8%85%90.png",
    "浆果糕": "https://oxygennotincluded.wiki.gg/zh/images/thumb/4/4d/%E6%B5%86%E6%9E%9C%E7%B3%95.png/50px-%E6%B5%86%E6%9E%9C%E7%B3%95.png",
    "烤肉串": "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/c2/%E7%83%A4%E8%82%89%E4%B8%B2.png/52px-%E7%83%A4%E8%82%89%E4%B8%B2.png",
    "烤海鲜": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/3b/%E7%83%A4%E6%B5%B7%E9%B2%9C.png/70px-%E7%83%A4%E6%B5%B7%E9%B2%9C.png",
    "蛋奶酥煎饼": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/59/%E8%9B%8B%E5%A5%B6%E9%85%A5%E7%85%8E%E9%A5%BC.png/32px-%E8%9B%8B%E5%A5%B6%E9%85%A5%E7%85%8E%E9%A5%BC.png",
    "浆果酿": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/a6/%E6%B5%86%E6%9E%9C%E9%85%BF.png/30px-%E6%B5%86%E6%9E%9C%E9%85%BF.png",
    "蘑菇卷": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/5b/%E8%98%91%E8%8F%87%E5%8D%B7.png/46px-%E8%98%91%E8%8F%87%E5%8D%B7.png",
    "海陆双拼": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/76/%E6%B5%B7%E9%99%86%E5%8F%8C%E6%8B%BC.png/33px-%E6%B5%B7%E9%99%86%E5%8F%8C%E6%8B%BC.png",
    "火椒面包": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/a3/%E7%81%AB%E6%A4%92%E9%9D%A2%E5%8C%85.png/47px-%E7%81%AB%E6%A4%92%E9%9D%A2%E5%8C%85.png",
    "麻婆豆腐": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/fb/%E9%BA%BB%E5%A9%86%E8%B1%86%E8%85%90.png/46px-%E9%BA%BB%E5%A9%86%E8%B1%86%E8%85%90.png",
    "蘑菇乳蛋饼": "https://oxygennotincluded.wiki.gg/zh/images/thumb/6/6f/%E8%98%91%E8%8F%87%E4%B9%B3%E8%9B%8B%E9%A5%BC.png/42px-%E8%98%91%E8%8F%87%E4%B9%B3%E8%9B%8B%E9%A5%BC.png",
    "冰霜汉堡": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/da/%E5%86%B0%E9%9C%9C%E6%B1%89%E5%A0%A1.png/38px-%E5%86%B0%E9%9C%9C%E6%B1%89%E5%A0%A1.png",
    "咖喱豆": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/36/%E5%92%96%E5%96%B1%E8%B1%86.png/55px-%E5%92%96%E5%96%B1%E8%B1%86.png",
    "植物肉": "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/ea/%E6%A4%8D%E7%89%A9%E8%82%89.png/52px-%E6%A4%8D%E7%89%A9%E8%82%89.png",
    "沼浆果冻": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/98/%E6%B2%BC%E6%B5%86%E6%9E%9C%E5%86%BB.png/34px-%E6%B2%BC%E6%B5%86%E6%9E%9C%E5%86%BB.png",
    "沼泽欢愉": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/33/%E6%B2%BC%E6%B3%BD%E6%AC%A2%E6%84%89.png/39px-%E6%B2%BC%E6%B3%BD%E6%AC%A2%E6%84%89.png",
    "贫瘠虫果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/dd/%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C.png/33px-%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C.png",
    "烤虫果仁": "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/82/%E7%83%A4%E8%99%AB%E6%9E%9C%E4%BB%81.png/41px-%E7%83%A4%E8%99%AB%E6%9E%9C%E4%BB%81.png",
    "虫果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/e5/%E8%99%AB%E6%9E%9C.png/29px-%E8%99%AB%E6%9E%9C.png",
    "虫果果酱": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/a4/%E8%99%AB%E6%9E%9C%E6%9E%9C%E9%85%B1.png/28px-%E8%99%AB%E6%9E%9C%E6%9E%9C%E9%85%B1.png",
    "混合浆果派": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/34/%E6%B7%B7%E5%90%88%E6%B5%86%E6%9E%9C%E6%B4%BE.png/42px-%E6%B7%B7%E5%90%88%E6%B5%86%E6%9E%9C%E6%B4%BE.png",
    "羽叶果薯": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/52/%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF.png/39px-%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF.png",
    "果薯条": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/90/%E6%9E%9C%E8%96%AF%E6%9D%A1.png/25px-%E6%9E%9C%E8%96%AF%E6%9D%A1.png",
    "鱼肉卷": "https://oxygennotincluded.wiki.gg/zh/images/thumb/2/29/%E9%B1%BC%E8%82%89%E5%8D%B7.png/40px-%E9%B1%BC%E8%82%89%E5%8D%B7.png",
    "蟹肉天妇罗": "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/c7/%E8%9F%B9%E8%82%89%E5%A4%A9%E5%A6%87%E7%BD%97.png/28px-%E8%9F%B9%E8%82%89%E5%A4%A9%E5%A6%87%E7%BD%97.png",
    "刺壳果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/f4/%E5%88%BA%E5%A3%B3%E6%9E%9C.png/43px-%E5%88%BA%E5%A3%B3%E6%9E%9C.png",
    "刺壳果烤串": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/77/%E5%88%BA%E5%A3%B3%E6%9E%9C%E7%83%A4%E4%B8%B2.png/38px-%E5%88%BA%E5%A3%B3%E6%9E%9C%E7%83%A4%E4%B8%B2.png",
    "干肉饼": "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/e3/%E5%B9%B2%E8%82%89%E9%A5%BC.png/53px-%E5%B9%B2%E8%82%89%E9%A5%BC.png",

    "掩埋的淤泥根": "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/17/%E6%8E%A9%E5%9F%8B%E7%9A%84%E6%B7%A4%E6%B3%A5%E6%A0%B9.png/50px-%E6%8E%A9%E5%9F%8B%E7%9A%84%E6%B7%A4%E6%B3%A5%E6%A0%B9.png",
    "淤泥根": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/98/%E6%B7%A4%E6%B3%A5%E6%A0%B9.png/22px-%E6%B7%A4%E6%B3%A5%E6%A0%B9.png",
    "六角根": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/50/%E5%85%AD%E8%A7%92%E6%A0%B9.png/50px-%E5%85%AD%E8%A7%92%E6%A0%B9.png",
    "六角根果实": "https://oxygennotincluded.wiki.gg/zh/images/thumb/6/6f/%E5%85%AD%E8%A7%92%E6%A0%B9%E6%9E%9C%E5%AE%9E.png/44px-%E5%85%AD%E8%A7%92%E6%A0%B9%E6%9E%9C%E5%AE%9E.png",
    "米虱木": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/a4/%E7%B1%B3%E8%99%B1%E6%9C%A8.png/50px-%E7%B1%B3%E8%99%B1%E6%9C%A8.png",
    //"米虱": "https://oxygennotincluded.wiki.gg/zh/images/thumb/2/2f/%E7%B1%B3%E8%99%B1.png/51px-%E7%B1%B3%E8%99%B1.png",
    "毛刺花": "https://oxygennotincluded.wiki.gg/zh/images/thumb/c/cd/%E6%AF%9B%E5%88%BA%E8%8A%B1.png/50px-%E6%AF%9B%E5%88%BA%E8%8A%B1.png",
    //"毛刺浆果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/90/%E6%AF%9B%E5%88%BA%E6%B5%86%E6%9E%9C.png/26px-%E6%AF%9B%E5%88%BA%E6%B5%86%E6%9E%9C.png",
    "夜幕菇": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/55/%E5%A4%9C%E5%B9%95%E8%8F%87.png/50px-%E5%A4%9C%E5%B9%95%E8%8F%87.png",
    //"蘑菇": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/3b/%E8%98%91%E8%8F%87.png/45px-%E8%98%91%E8%8F%87.png",
    "冰霜小麦": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/52/%E5%86%B0%E9%9C%9C%E5%B0%8F%E9%BA%A6.png/50px-%E5%86%B0%E9%9C%9C%E5%B0%8F%E9%BA%A6.png",
    "冰霜麦粒": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/52/%E5%86%B0%E9%9C%9C%E9%BA%A6%E7%B2%92.png/55px-%E5%86%B0%E9%9C%9C%E9%BA%A6%E7%B2%92.png",
    "小吃芽": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/5c/%E5%B0%8F%E5%90%83%E8%8A%BD.png/50px-%E5%B0%8F%E5%90%83%E8%8A%BD.png",
    "小吃豆": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/78/%E5%B0%8F%E5%90%83%E8%B1%86.png/40px-%E5%B0%8F%E5%90%83%E8%B1%86.png",
    "水草": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/57/%E6%B0%B4%E8%8D%89.png/50px-%E6%B0%B4%E8%8D%89.png",
    //"海生菜": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/9c/%E6%B5%B7%E7%94%9F%E8%8F%9C.png/40px-%E6%B5%B7%E7%94%9F%E8%8F%9C.png",
    "火椒藤": "https://oxygennotincluded.wiki.gg/zh/images/thumb/7/7a/%E7%81%AB%E6%A4%92%E8%97%A4.png/50px-%E7%81%AB%E6%A4%92%E8%97%A4.png",
    "火椒粒": "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/8f/%E7%81%AB%E6%A4%92%E7%B2%92.png/32px-%E7%81%AB%E6%A4%92%E7%B2%92.png",
    "沼浆笼": "https://oxygennotincluded.wiki.gg/zh/images/thumb/0/00/%E6%B2%BC%E6%B5%86%E7%AC%BC.png/50px-%E6%B2%BC%E6%B5%86%E7%AC%BC.png",
    //"沼浆果冻": "https://oxygennotincluded.wiki.gg/zh/images/thumb/9/98/%E6%B2%BC%E6%B5%86%E6%9E%9C%E5%86%BB.png/34px-%E6%B2%BC%E6%B5%86%E6%9E%9C%E5%86%BB.png",
    "贫瘠虫果芽": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/d9/%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C%E8%8A%BD.png/50px-%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C%E8%8A%BD.png",
    //"贫瘠虫果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/dd/%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C.png/33px-%E8%B4%AB%E7%98%A0%E8%99%AB%E6%9E%9C.png",
    "虫果芽": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/d7/%E8%99%AB%E6%9E%9C%E8%8A%BD.png/50px-%E8%99%AB%E6%9E%9C%E8%8A%BD.png",
    //"虫果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/e5/%E8%99%AB%E6%9E%9C.png/29px-%E8%99%AB%E6%9E%9C.png",
    "沼泽甜菜": "https://oxygennotincluded.wiki.gg/zh/images/thumb/6/67/%E6%B2%BC%E6%B3%BD%E7%94%9C%E8%8F%9C.png/50px-%E6%B2%BC%E6%B3%BD%E7%94%9C%E8%8F%9C.png",
    "沼泽甜菜心": "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/15/%E6%B2%BC%E6%B3%BD%E7%94%9C%E8%8F%9C%E5%BF%83.png/22px-%E6%B2%BC%E6%B3%BD%E7%94%9C%E8%8F%9C%E5%BF%83.png",
    "土星动物捕草": "https://oxygennotincluded.wiki.gg/zh/images/thumb/3/35/%E5%9C%9F%E6%98%9F%E5%8A%A8%E7%89%A9%E6%8D%95%E8%8D%89.png/50px-%E5%9C%9F%E6%98%9F%E5%8A%A8%E7%89%A9%E6%8D%95%E8%8D%89.png",
    //"植物肉": "https://oxygennotincluded.wiki.gg/zh/images/thumb/e/ea/%E6%A4%8D%E7%89%A9%E8%82%89.png/52px-%E6%A4%8D%E7%89%A9%E8%82%89.png",
    "雪莓藤": "https://oxygennotincluded.wiki.gg/zh/images/thumb/b/b8/%E9%9B%AA%E8%8E%93%E8%97%A4.png/50px-%E9%9B%AA%E8%8E%93%E8%97%A4.png",
    "雪莓": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/f2/%E9%9B%AA%E8%8E%93.png/39px-%E9%9B%AA%E8%8E%93.png",
    "刺壳果灌木": "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/14/%E5%88%BA%E5%A3%B3%E6%9E%9C%E7%81%8C%E6%9C%A8.png/50px-%E5%88%BA%E5%A3%B3%E6%9E%9C%E7%81%8C%E6%9C%A8.png",
    //"刺壳果": "https://oxygennotincluded.wiki.gg/zh/images/thumb/f/f4/%E5%88%BA%E5%A3%B3%E6%9E%9C.png/43px-%E5%88%BA%E5%A3%B3%E6%9E%9C.png",
    "羽叶果薯植株": "https://oxygennotincluded.wiki.gg/zh/images/thumb/1/14/%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF%E6%A4%8D%E6%A0%AA.png/50px-%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF%E6%A4%8D%E6%A0%AA.png",
    //"羽叶果薯": "https://oxygennotincluded.wiki.gg/zh/images/thumb/5/52/%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF.png/39px-%E7%BE%BD%E5%8F%B6%E6%9E%9C%E8%96%AF.png",
    "汗甜玉米杆": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/ad/%E6%B1%97%E7%94%9C%E7%8E%89%E7%B1%B3.png/52px-%E6%B1%97%E7%94%9C%E7%8E%89%E7%B1%B3.png",
    "汗甜玉米": "https://oxygennotincluded.wiki.gg/zh/images/thumb/a/ad/%E6%B1%97%E7%94%9C%E7%8E%89%E7%B1%B3.png/52px-%E6%B1%97%E7%94%9C%E7%8E%89%E7%B1%B3.png",
    "巨蕨": "https://oxygennotincluded.wiki.gg/zh/images/thumb/8/8f/%E5%B7%A8%E8%95%A8.png/29px-%E5%B7%A8%E8%95%A8.png",
    "巨蕨谷粒": "https://oxygennotincluded.wiki.gg/zh/images/thumb/d/df/%E5%B7%A8%E8%95%A8%E8%B0%B7%E7%B2%92.png/37px-%E5%B7%A8%E8%95%A8%E8%B0%B7%E7%B2%92.png"
};