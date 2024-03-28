import { RarityLoader } from "../Loaders/RarityLoader.js";
import { Utility } from "../Utilities.js";
import { Terraria, Microsoft, System } from "../ModImports.js";

const Main = Terraria.Main;
const ID = Terraria.ID;
const PopupText = Terraria.PopupText;
const FontAssets = Terraria.GameContent.FontAssets;
const ItemRarity = Terraria.GameContent.ItemRarity;
const CustomCurrencyManager = Terraria.GameContent.UI.CustomCurrencyManager;
const Color = Microsoft.Xna.Framework.Graphics.Color;
const String = System.String;
const Math = System.Math;
const Convert = System.Convert;

const NewText = PopupText["int NewText(PopupTextContext context, Item newItem, int stack, bool noStack, bool longText)"];
const ValueToName = PopupText["string ValueToText(long coinValue)"];
const Min = Math["int Min(int val1, int val2)"];
const ToString = Convert["string ToString(int value)"];

export function Initialize() {
    ItemRarity.Initialize.hook((original) => {
        original();

        ItemRarity._rarities.Add(10, ID.Colors.RarityDarkRed);
        ItemRarity._rarities.Add(11, ID.Colors.RarityDarkPurple);
        for (let i = 12; i < RarityLoader.RarityCount; i++) {
            ItemRarity._rarities.Add(i, RarityLoader.GetRarity(i).RarityColor);
        }
    });

    NewText.hook((original, context, newItem, stack, noStack, longText) => {
        if (!Main.showItemText) {
            return -1;
        }
        if (newItem.Name == null || !newItem.active) {
            return -1;
        }
        if (Main.netMode == 2) {
            return -1;
        }

        let flag = newItem.type >= 71 && newItem.type <= 74;
        for (let i = 0; i < 20; i++) {
            const popupText = Main.popupText[i];
            if (!popupText.active || popupText.notActuallyAnItem || (!(popupText.name == newItem.AffixName()) && (!flag || !popupText.coinText)) || popupText.NoStack || noStack) {
                continue;
            }

            let text = newItem.Name + " (" + (popupText.stack + stack) + ")";
            let text2 = newItem.Name;
            if (popupText.stack > 1) {
                text2 = text2 + " (" + popupText.stack + ")";
            }

            let vector = FontAssets.MouseText.Value.MeasureString(text2);
            vector = FontAssets.MouseText.Value.MeasureString(text);
            if (popupText.lifeTime < 0) {
                popupText.scale = 1;
            }
            if (popupText.lifeTime < 60) {
                popupText.lifeTime = 60;
            }
            if (flag && popupText.coinText) {
                let num = 0;
                switch (newItem.type) {
                    case 71:
                        num += stack;
                        break;
                    case 72:
                        num += 100 * stack;
                        break;
                    case 73:
                        num += 10000 * stack;
                        break;
                    case 74:
                        num += 1000000 * stack;
                        break;
                }

                popupText.AddToCoinValue(num);
                text = ValueToName(popupText.coinValue);
                vector = FontAssets.MouseText.Value.MeasureString(text);
                popupText.name = text;

                if (popupText.coinValue >= 1000000) {
                    if (popupText.lifeTime < 300) {
                        popupText.lifeTime = 300;
                    }
                    popupText.color = Color(220, 220, 198);
                }
                else if (popupText.coinValue >= 10000)
                {
                    if (popupText.lifeTime < 240)
                    {
                        popupText.lifeTime = 240;
                    }
                    popupText.color = new Color(224, 201, 92);
                }
                else if (popupText.coinValue >= 100)
                {
                    if (popupText.lifeTime < 180)
                    {
                        popupText.lifeTime = 180;
                    }
                    popupText.color = new Color(181, 192, 193);
                }
                else if (popupText.coinValue >= 1)
                {
                    if (popupText.lifeTime < 120)
                    {
                        popupText.lifeTime = 120;
                    }
                    popupText.color = Utility.Color(false, 246, 138, 96);
                }
            }

            popupText.stack += stack;
            popupText.scale = 0;
            popupText.rotation = 0;
            popupText.position.X = newItem.position.X + newItem.width * 0.5 - vector.X * 0.5;
            popupText.position.Y = newItem.position.Y + newItem.height * 0.25 - vector.Y * 0.5;
            popupText.velocity.Y = -7;
            popupText.context = context;
            popupText.npcNetID = 0;
            if (popupText.coinText) {
                popupText.stack = 1;
            }

            return i;
        }

        let num2 = PopupText.FindNextItemTextSlot();
        if (num2 >= 0) {
            let text3 = newItem.AffixName();
            if (stack > 1) {
                text3 = text3 + " (" + stack + ")";
            }

            const vector2 = FontAssets.MouseText.Value.MeasureString(text3);
            const popupText2 = Main.popupText[num2];
            PopupText.ResetText(popupText2);
            popupText2.active = true;
            popupText2.position.X = newItem.position.X + newItem.width * 0.5 - vector2.X * 0.5;
            popupText2.position.Y = newItem.position.Y + newItem.height * 0.25 - vector2.Y * 0.5;
            popupText2.color = Color.White;
            if (newItem.rare === 1) {
                popupText2.color = Utility.Color(false, 150, 150, 255);
            }
            else if (newItem.rare === 2) {
                popupText2.color = Utility.Color(false, 150, 255, 150);
            }
            else if (newItem.rare === 3) {
                popupText2.color = Utility.Color(false, 255, 200, 150);
            } 
            else if (newItem.rare === 4) {
                popupText2.color = Utility.Color(false, 255, 150, 150);
            }
            else if (newItem.rare === 5) {
                popupText2.color = Utility.Color(false, 255, 150, 255);
            }
            else if (newItem.rare === -13) {
            popupText2.master = true;
            } 
            else if (newItem.rare === -11) {
                popupText2.color = Utility.Color(false, 255, 175, 0);
            } 
            else if (newItem.rare === -1) {
                popupText2.color = Utility.Color(false, 130, 130, 130);
            } 
            else if (newItem.rare === 6) {
                popupText2.color = Utility.Color(false, 210, 160, 255);
            } 
            else if (newItem.rare === 7) {
                popupText2.color = Utility.Color(false, 150, 255, 10);
            } 
            else if (newItem.rare === 8) {
                popupText2.color = Utility.Color(false, 255, 255, 10);
            } 
            else if (newItem.rare === 9) {
                popupText2.color = Utility.Color(false, 5, 200, 255);
            } 
            else if (newItem.rare === 10) {
                popupText2.color = Utility.Color(false, 255, 40, 100);
            } 
            else if (newItem.rare === 11) {
                popupText2.color = Utility.Color(false, 180, 40, 255);
            }        
            else if (newItem.rare >= 12) {
                popupText2.color = RarityLoader.GetRarity(newItem.rare).RarityColor;
            }

            popupText2.rarity = newItem.rare;
            popupText2.expert = newItem.expert;
            popupText2.master = newItem.master;
            popupText2.name = newItem.AffixName();
            popupText2.stack = stack;
            popupText2.velocity.Y = -7;
            popupText2.lifeTime = 60;
            popupText2.context = context;
            if (longText) {
                popupText2.lifeTime *= 5;
            }

            popupText2.coinValue = 0;
            popupText2.coinText = newItem.type >= 71 && newItem.type <= 74;
            if (popupText2.coinText) {
                let num3 = 0;
                if (newItem.type == 71) {
                    num3 += popupText2.stack;
                }
                else if (newItem.type == 72) {
                    num3 += 100 * popupText2.stack;
                }
                else if (newItem.type == 73) {
                    num3 += 10000 * popupText2.stack;
                }
                else if (newItem.type == 74) {
                    num3 += 1000000 * popupText2.stack;
                }

                popupText2.AddToCoinValue(num3);
                popupText2.ValueToName();
                popupText2.stack = 1;
                if (popupText2.coinValue >= 1000000) {
                    if (popupText2.lifeTime < 300) {
                        popupText2.lifeTime = 300;
                    }
                    popupText2.color = Utility.Color(false, 220, 220, 198);
                }

                else if (popupText2.coinValue >= 10000) {
                    if (popupText2.lifeTime < 240) {
                        popupText2.lifeTime = 240;
                    }
                    popupText2.color = Utility.Color(false, 224, 201, 92);
                }

                else if (popupText2.coinValue >= 100) {
                    if (popupText2.lifeTime < 180) {
                        popupText2.lifeTime = 180;
                    }
                    popupText2.color = Utility.Color(false, 181, 192, 193);
                }

                else if (popupText2.coinValue >= 1) {
                    if (popupText2.lifeTime < 120)
                    {
                        popupText2.lifeTime = 120;
                    }
                    popupText2.color = Utility.Color(false, 246, 138, 96);
                }
            }
        }
        return num2;
    });

    Main.MouseText_DrawItemTooltip.hook((original, self, info, rare, diff, X, Y) => {
		const settingsEnabled_OpaqueBoxBehindTooltips = Main.SettingsEnabled_OpaqueBoxBehindTooltips;
        const color = Utility.Color(false, Main.mouseTextColor, Main.mouseTextColor, Main.mouseTextColor, Main.mouseTextColor);
        const hoverItem = Main.HoverItem;
        const yoyoLogo = -1;
        const researchLine = -1;
        const rare = hoverItem.rare;
        const knockBack = hoverItem.knockBack;

        let num = 1;
        if (hoverItem.melee && Main.player[Main.myPlayer].kbGlove) {
            num += 1;
        }
        if (Main.player[Main.myPlayer].kbBuff) {
            num += 0.5;
        }
        if (num != 1) {
            hoverItem.knockBack *= num;
        }
        if (hoverItem.ranged && Main.player[Main.myPlayer].shroomiteStealth) {
            hoverItem.knockBack *= 1 + (1 - Main.player[Main.myPlayer].stealth) * 0.5;
        }

        const num2 = 30;
        const numLines = 1;
        const array = new Array(num2).fill(String.Empty);
        const array2 = new Array(num2).fill(false);
        const array3 = new Array(num2).fill(false);
        const tooltipNames = new Array(num2).fill(String.Empty);

        let prefixlineIndex;
        Main.MouseText_DrawItemTooltip_GetLinesInfo(hoverItem, yoyoLogo, researchLine, knockBack, numLines, array, array2, array3, tooltipNames, prefixlineIndex);

        const num3 = Main.mouseTextColor / 255;
        const num4 = num3;
        const a = Main.mouseTextColor;

        if (Main.npcShop > 0 && hoverItem.value >= 0 && (hoverItem.type < 71 || hoverItem.type > 74)) {
            let calcForSelling;
            let calcForBuying;
            Main.LocalPlayer.GetItemExpectedPrice(hoverItem, calcForSelling, calcForBuying);

            let num5 = hoverItem.isAShopItem || hoverItem.buyOnce ? calcForBuying : calcForSelling;
            if (hoverItem.shopSpecialCurrency != -1) {
                tooltipNames[numLines] = "SpecialPrice";
                CustomCurrencyManager.GetPriceText(hoverItem.shopSpecialCurrency, array, numLines, num5);
                color = Utility.Color((255 * num4) & 0xFF, (255 * num4) & 0xFF, (255 * num4) & 0xFF, a);
            }

            else if (num5 > 0) {
                let text = "";
                let num6 = 0;
                let num7 = 0;
                let num8 = 0;
                let num9 = 0;
                let num10 = num5 * hoverItem.stack;

                if (!hoverItem.buy) {
                    num10 = num5 / 5;
                    if (num10 < 1) {
                        num10 = 1;
                    }

                    const num11 = num10;
                    num10 *= hoverItem.stack;
                    const amount = Main.shopSellbackHelper.GetAmount(hoverItem);
                    if (amount > 0) {
                        num10 += (-num11 + calcForBuying) * Min(amount, hoverItem.stack);
                    }
                }

                if (num10 < 1) {
                    num10 = 1;
                }
                if (num10 >= 1000000) {
                    num6 = num10 / 1000000;
                    num10 -= num6 * 1000000;
                }
                if (num10 >= 10000) {
                    num7 = num10 / 10000;
                    num10 -= num7 * 10000;
                }
                if (num10 >= 100) {
                    num8 = num10 / 100;
                    num10 -= num8 * 100;
                }
                if (num10 >= 1) {
                    num9 = num10;
                }
                if (num6 > 0) {
                    text = string.Concat(
                        [
                            text,
                            ToString(num6),
                            " ",
                            Lang.inter[15].Value,
                            " "
                        ]
                    );
                }
                if (num7 > 0L)
                {
                    text = string.Concat(new string[]
                    {
                        text,
                        num7.ToString(),
                        " ",
                        Lang.inter[16].Value,
                        " "
                    });
                }
                if (num8 > 0L)
                {
                    text = string.Concat(new string[]
                    {
                        text,
                        num8.ToString(),
                        " ",
                        Lang.inter[17].Value,
                        " "
                    });
                }
                if (num9 > 0L)
                {
                    text = string.Concat(new string[]
                    {
                        text,
                        num9.ToString(),
                        " ",
                        Lang.inter[18].Value,
                        " "
                    });
                }
                if (!hoverItem.buy)
                {
                    array[numLines] = Lang.tip[49].Value + " " + text;
                }
                else
                {
                    array[numLines] = Lang.tip[50].Value + " " + text;
                }
                tooltipNames[numLines] = "Price";
                numLines++;
                if (num6 > 0L)
                {
                    color..ctor((int)((byte)(220f * num4)), (int)((byte)(220f * num4)), (int)((byte)(198f * num4)), a);
                }
                else if (num7 > 0L)
                {
                    color..ctor((int)((byte)(224f * num4)), (int)((byte)(201f * num4)), (int)((byte)(92f * num4)), a);
                }
                else if (num8 > 0L)
                {
                    color..ctor((int)((byte)(181f * num4)), (int)((byte)(192f * num4)), (int)((byte)(193f * num4)), a);
                }
                else if (num9 > 0L)
                {
                    color..ctor((int)((byte)(246f * num4)), (int)((byte)(138f * num4)), (int)((byte)(96f * num4)), a);
                }
            }
            else if (hoverItem.type != 3817)
            {
                array[numLines] = Lang.tip[51].Value;
                tooltipNames[numLines] = "Price";
                numLines++;
                color..ctor((int)((byte)(120f * num4)), (int)((byte)(120f * num4)), (int)((byte)(120f * num4)), a);
            }
        }
        Vector2 zero = Vector2.Zero;
        Color?[] overrideColor;
        List<TooltipLine> lines = ItemLoader.ModifyTooltips(Main.HoverItem, ref numLines, tooltipNames, ref array, ref array2, ref array3, ref yoyoLogo, out overrideColor, prefixlineIndex);
        List<DrawableTooltipLine> drawableLines = lines.Select((TooltipLine x, int i) => new DrawableTooltipLine(x, i, 0, 0, Color.White)).ToList<DrawableTooltipLine>();
        int num12 = 0;
        for (int j = 0; j < numLines; j++)
        {
            Vector2 stringSize = ChatManager.GetStringSize(FontAssets.MouseText.Value, array[j], Vector2.One, -1f);
            if (stringSize.X > zero.X)
            {
                zero.X = stringSize.X;
            }
            zero.Y += stringSize.Y + (float)num12;
        }
        if (yoyoLogo != -1)
        {
            zero.Y += 24f;
        }
        X += Main.toolTipDistance;
        Y += Main.toolTipDistance;
        int num13 = 4;
        if (settingsEnabled_OpaqueBoxBehindTooltips)
        {
            X += 8;
            Y += 2;
            num13 = 18;
        }
        int num14 = Main.screenWidth;
        int num15 = Main.screenHeight;
        if ((float)X + zero.X + (float)num13 > (float)num14)
        {
            X = (int)((float)num14 - zero.X - (float)num13);
        }
        if ((float)Y + zero.Y + (float)num13 > (float)num15)
        {
            Y = (int)((float)num15 - zero.Y - (float)num13);
        }
        int num16 = 0;
        num3 = (float)Main.mouseTextColor / 255f;
        if (settingsEnabled_OpaqueBoxBehindTooltips)
        {
            num3 = MathHelper.Lerp(num3, 1f, 1f);
            int num17 = 14;
            int num18 = 9;
            Utils.DrawInvBG(Main.spriteBatch, new Rectangle(X - num17, Y - num18, (int)zero.X + num17 * 2, (int)zero.Y + num18 + num18 / 2), new Color(23, 25, 81, 255) * 0.925f);
        }
        bool globalCanDraw = ItemLoader.PreDrawTooltip(Main.HoverItem, lines.AsReadOnly(), ref X, ref Y);
        for (int k = 0; k < numLines; k++)
        {
            drawableLines[k].OriginalX = X;
            drawableLines[k].OriginalY = Y + num16;
            if (drawableLines[k].Mod == "Terraria" && drawableLines[k].Name == "OneDropLogo")
            {
                float num19 = 1f;
                int num20 = (int)((float)Main.mouseTextColor * num19);
                Color color2 = Color.Black;
                drawableLines[k].Color = new Color(num20, num20, num20, num20);
                if (ItemLoader.PreDrawTooltipLine(Main.HoverItem, drawableLines[k], ref num12) && globalCanDraw)
                {
                    for (int l = 0; l < 5; l++)
                    {
                        int num21 = drawableLines[k].X;
                        int num22 = drawableLines[k].Y;
                        if (l == 4)
                        {
                            color2..ctor(num20, num20, num20, num20);
                        }
                        switch (l)
                        {
                        case 0:
                            num21--;
                            break;
                        case 1:
                            num21++;
                            break;
                        case 2:
                            num22--;
                            break;
                        case 3:
                            num22++;
                            break;
                        }
                        Color drawColor2 = drawableLines[k].OverrideColor ?? drawableLines[k].Color;
                        Main.spriteBatch.Draw(TextureAssets.OneDropLogo.Value, new Vector2((float)num21, (float)num22), null, (l != 4) ? color2 : drawColor2, drawableLines[k].Rotation, drawableLines[k].Origin, (drawableLines[k].BaseScale.X + drawableLines[k].BaseScale.Y) / 2f, 0, 0f);
                    }
                }
            }
            else
            {
                Color black = Color.Black;
                black..ctor(num4, num4, num4, num4);
                if (drawableLines[k].Mod == "Terraria" && drawableLines[k].Name == "ItemName")
                {
                    if (rare == -11)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(175f * num4)), (int)((byte)(0f * num4)), a);
                    }
                    if (rare == -1)
                    {
                        black..ctor((int)((byte)(130f * num4)), (int)((byte)(130f * num4)), (int)((byte)(130f * num4)), a);
                    }
                    if (rare == 1)
                    {
                        black..ctor((int)((byte)(150f * num4)), (int)((byte)(150f * num4)), (int)((byte)(255f * num4)), a);
                    }
                    if (rare == 2)
                    {
                        black..ctor((int)((byte)(150f * num4)), (int)((byte)(255f * num4)), (int)((byte)(150f * num4)), a);
                    }
                    if (rare == 3)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(200f * num4)), (int)((byte)(150f * num4)), a);
                    }
                    if (rare == 4)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(150f * num4)), (int)((byte)(150f * num4)), a);
                    }
                    if (rare == 5)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(150f * num4)), (int)((byte)(255f * num4)), a);
                    }
                    if (rare == 6)
                    {
                        black..ctor((int)((byte)(210f * num4)), (int)((byte)(160f * num4)), (int)((byte)(255f * num4)), a);
                    }
                    if (rare == 7)
                    {
                        black..ctor((int)((byte)(150f * num4)), (int)((byte)(255f * num4)), (int)((byte)(10f * num4)), a);
                    }
                    if (rare == 8)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(255f * num4)), (int)((byte)(10f * num4)), a);
                    }
                    if (rare == 9)
                    {
                        black..ctor((int)((byte)(5f * num4)), (int)((byte)(200f * num4)), (int)((byte)(255f * num4)), a);
                    }
                    if (rare == 10)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(40f * num4)), (int)((byte)(100f * num4)), a);
                    }
                    if (rare == 11)
                    {
                        black..ctor((int)((byte)(180f * num4)), (int)((byte)(40f * num4)), (int)((byte)(255f * num4)), a);
                    }
                    if (rare > 11)
                    {
                        black = RarityLoader.GetRarity(rare).RarityColor * num4;
                    }
                    if (diff == 1)
                    {
                        black..ctor((int)((byte)((float)Main.mcColor.R * num4)), (int)((byte)((float)Main.mcColor.G * num4)), (int)((byte)((float)Main.mcColor.B * num4)), a);
                    }
                    if (diff == 2)
                    {
                        black..ctor((int)((byte)((float)Main.hcColor.R * num4)), (int)((byte)((float)Main.hcColor.G * num4)), (int)((byte)((float)Main.hcColor.B * num4)), a);
                    }
                    if (hoverItem.expert || rare == -12)
                    {
                        black..ctor((int)((byte)((float)Main.DiscoR * num4)), (int)((byte)((float)Main.DiscoG * num4)), (int)((byte)((float)Main.DiscoB * num4)), a);
                    }
                    if (hoverItem.master || rare == -13)
                    {
                        black..ctor((int)((byte)(255f * num4)), (int)((byte)(Main.masterColor * 200f * num4)), 0, a);
                    }
                }
                else if (array2[k])
                {
                    black = ((!array3[k]) ? new Color((int)((byte)(120f * num4)), (int)((byte)(190f * num4)), (int)((byte)(120f * num4)), a) : new Color((int)((byte)(190f * num4)), (int)((byte)(120f * num4)), (int)((byte)(120f * num4)), a));
                }
                else if (drawableLines[k].Mod == "Terraria" && drawableLines[k].Name == "Price")
                {
                    black = color;
                }
                if (drawableLines[k].Mod == "Terraria" && drawableLines[k].Name == "JourneyResearch")
                {
                    black = Colors.JourneyMode;
                }
                drawableLines[k].Color = black;
                Color realLineColor = black;
                if (overrideColor[k] != null)
                {
                    realLineColor = overrideColor[k].Value * num4;
                    drawableLines[k].OverrideColor = new Color?(realLineColor);
                }
                if (ItemLoader.PreDrawTooltipLine(Main.HoverItem, drawableLines[k], ref num12) && globalCanDraw)
                {
                    ChatManager.DrawColorCodedStringWithShadow(Main.spriteBatch, drawableLines[k].Font, drawableLines[k].Text, new Vector2((float)drawableLines[k].X, (float)drawableLines[k].Y), realLineColor, drawableLines[k].Rotation, drawableLines[k].Origin, drawableLines[k].BaseScale, drawableLines[k].MaxWidth, drawableLines[k].Spread);
                }
            }
            ItemLoader.PostDrawTooltipLine(Main.HoverItem, drawableLines[k]);
            num16 += (int)(FontAssets.MouseText.Value.MeasureString(drawableLines[k].Text).Y + (float)num12);
        }
        ItemLoader.PostDrawTooltip(Main.HoverItem, drawableLines.AsReadOnly());
    }