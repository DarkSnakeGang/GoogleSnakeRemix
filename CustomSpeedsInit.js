window.CustomSpeeds = {};

window.remixClampSpeedMult = function remixClampSpeedMult(v, fallback) {
  let n = Number(v);
  if (!Number.isFinite(n)) n = fallback;
  if (n < 0.00001) n = 0.00001;
  if (n > 18.5) n = 18.5;
  return n;
};

window.remixEnsureCustomSpeedSettings = function remixEnsureCustomSpeedSettings() {
  if (!window.pudding_settings) window.pudding_settings = {};
  window.pudding_settings.CustomSpeedMult = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedMult,
    1.0
  );
  window.pudding_settings.CustomSpeedA = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedA,
    1.0
  );
  window.pudding_settings.CustomSpeedB = window.remixClampSpeedMult(
    window.pudding_settings.CustomSpeedB,
    0.66
  );
  if (typeof window.remixSpeedSwitchState !== "number") {
    window.remixSpeedSwitchState = 0;
  }
};

window.remixCustomSpeedMult = function remixCustomSpeedMult() {
  window.remixEnsureCustomSpeedSettings();
  return window.pudding_settings.CustomSpeedMult;
};

window.remixCustomSpeedSwitcherMult = function remixCustomSpeedSwitcherMult() {
  window.remixEnsureCustomSpeedSettings();
  return window.remixSpeedSwitchState
    ? window.pudding_settings.CustomSpeedB
    : window.pudding_settings.CustomSpeedA;
};

window.remixOnAppleEatenSpeedSwitch = function remixOnAppleEatenSpeedSwitch() {
  if (typeof window.CUSTOM_SPEED_SWITCH_INDEX !== "number") return;
  const root = document.querySelector("#speed");
  if (!root) return;
  let selected = -1;
  for (let i = 0; i < root.children.length; i++) {
    if (((root.children[i].className || "") + "").indexOf("tuJOWd") >= 0) {
      selected = i;
      break;
    }
  }
  if (selected !== window.CUSTOM_SPEED_SWITCH_INDEX) return;
  window.remixSpeedSwitchState = window.remixSpeedSwitchState ? 0 : 1;
};

window.remixResetSpeedSwitchState = function remixResetSpeedSwitchState() {
  window.remixSpeedSwitchState = 0;
};

window.CUSTOM_SPEED_ICON =
  "data:image/png;base64,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";

window.CUSTOM_SPEED_SWITCH_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAO/UlEQVR42m2Ya6xlZ1nHf+9t3fbae50z04FOp+1AHXpBSm1rLZABhShYpClKrIkYkYAWi4kfhIgRsRhDIiQiEYIhJhjhS5tCKASpBBDkVtoSWswUyvQ2bSntXM7Ze6211/W9+GHtmU7Rk+ycZ2dn/993r/d9/s/z/MQ5e/eGLMvQRrNarZjP5wBUVUWxKBjtSNu2FEVB23bYcWRRFNR1BUCezylXK7QxpGnKarUiy1K0NpNenhNCoF6vKYoF4zjSth1FsZj07MhisaCuahCT3mq1whhNmmaI8w8cCAGAgBCCsHn3bCwQgmdjYIqm/yFM32MTSymYJAJCSIL3IH5OD/Cb7wkBwW/WnkQ2cYAAMopjQvCMoyWOY5x1OOeIophxtIQQMCZi6AeEEBhj6PseqRRaKYahxxiDFIJxHIlMRAgBO1riKMJ5h3d+ozcSQiCKI8ZhQAqB1oZ+GFBKoZSkHwaMMQgh6YcesXfvnpClGdoYynJFPstBQF3VFEXBMI50XTcdcdMwWktRLKiqGoD5/P854jRFa82qXJHnc0IIrNc1xeIsvcWCtm0ZrZ2OuK4QQjCb5ZTlCq0NWZYiLrzwguCsw4eA0RprLQiBVgprLUIIlFKM44hUCqkU1lmU0ggB1jq01gTncM5itMF5T/AebQzWjoBAa4UdLUIKpFTYcURphRByE2sgYK3DaI0PAe8cUkpFCAHvHVIpfAgE75FKTQuFgJASBwgBoutwO7tQVlBWuJ0dxLoG5/CA1JOe8x4lJcEHQggopXDebe6pxHkPCKQQWOc291FMm1ISIcA5h9izZ0+YZRnGGJarFfN5DgiqqmKrKBispe06CqXonINLLiG/+irsPAep0ENP/cCPEEeOEFcVpfOksxlGKVblivl8QQj+567M5ApN02LHkaIoKKsKIWCez1muVkTGkGYp4uDBg2EcR7x3JHFC3/cgII5jur5HConue8TLX4a54QaclAyPPUbY2QHvCVmGOXghZs9e/L334G7/LHYY8FqTRNGkByRxTNt1SCkxxtC1LSaKUFLSdR1RHAMw9D1xkuCdYxhHNCEgzrYVsbGSEBAIRN+T3PQnjIcOsfziFxmPHMGdPEX2qleizz2X8pP/ht7eRp13Htl115H97d+w/uCHELu7hCjaWNbP2UoICPmsNU02ddrSTsfTnpTW6pYoiojimKqqSNMUqRTrpiEjkLzjJrrzDrD+/B0MRx5AmggRx+hzzgGlcCdPIvMct3MKTp4kFFuk11+P+N7d1Msl2WyGkoq6rsnzGcEH2rZhns8ZhoFhGFjM57Rti3OePJ+xrtcIKZnNMuRiUeCco1mvKbYK+qFnsJa5lPjDh7EXX8zyAx8gueIK8uteh1vXiCSm/9GPab79HWSaEuo1Zv95zG+8kerTn6Y9dgz1lrew0JpuGOj7nq2iYL1e47yfrKmq0EoxyzJWqxVxHBPHEatVySyfoZRitSpReZ7fggC5yTghBJIAUUR80ztY3XorfneH8dHHsM8ch+Cno1cKEUWEvkfEMeaC86m+dCcIyfDgT0ivvx5/7Bg88zQiivH+rEz1ASUlbCqKlJIQpuNWUp6pUFJKZNe2SCmJooi2a9FRhOx73BVXMK6WDD/4ATLLIHh8VYFUAKAkoe9BSrb++O2I2YzQNIgkxh8/Tn/vPYRrr0U7TxQZ+rYliWOkFPRdR5Ik+BAYhoEsTXHW4pwlTVOGoSd4T5amyKIocNaxbtYUxRZ91zN0Pfk1v0z/0MNEl16CyGbTZdYKwVSI/WqFSBP2vOc9uGGg/ea3kLPZlLEvvZzws6eIL7uEUmpOlh0y2+Lkao1znu1iTlmuUEoyyzKWyyVxEhNFMatyxWyWI5ViuVqhkiS5RUmJ0ppxHFBaoaRE/Nqr6Y4+RHb4FQitGB9+FBEZCBC8J736aoq3/hEyn7P7sY8ipCSMlvjgBcTXXcfxI48gd05x0fIYl297Lsw9eSxZDoKfVZYkijDCM1pHFEc45wjeY0w0VTOmHkBbO6LjBKUU674jMxFBa4LR+OUuux/7OHKxQCSTT/muI778JWy94ya8EJSf+hRhdxe5KNBKcurhJznnn/+Z913c8JtDSX44YjVMd21PqhgDfOsp+ORDCx446Sm0xcQzmrYFIItj1s0apRRxZNBFsUXTrOn6nmJRUK3X0LYUAZjNEEmMUBK8n7xJKdxyhT15EoDxwQcRSYrEs9PCdXvXfOSakkd2LJ84GvO9pwNX7gPrBfedcLz0HHjjIfjsb+zywftn/PvRDFutSGdTH7oqS4qiYBwGVuUKFRlzi9KayBjatiVKEmTX4S9+EeQ545EHEEnClGYgtMavlvT330931124nR10cJSj5MZ9JZ982ZL3f8fxgXskOx2senjzpfC8DL7xJJSD4Lajgv85AR9+xYAPgm+fzIgZsc6Tpil91wEQJwkyTEkNmyZRAMJo3H33EV12GWy6jDN/UoAxuOPHsSdOoMeR6NwDXKoa/vGXlrzz6/Cq8wWvPTg1teek8Kkfw21HYW86VZJXnRd4+4vh9/9T8Oe/2PK6CxzLHuRm/TC1q1Ml2X/uubcMw0A/9CwWBU3T4KQkW66Qhw/j7Ig9+hAiy0CALEtiqYi3tzFZinKe+E9vQh88yDc+dw/3nhRsJ1NX/UgJiYLGwuhBy8BuL7hsG55p4c7Hp89ufvHIbY/PiLWkquupwfCedbNGPG/fvhAnMUoqmqYhSRMQknZ3l/yqK5HvfCe7//QR7IkTRONAfvgw5oYbYLGYnqiQhGaN295Dd+vt7LvtE3RRgiSQavAB1FR2OdnCu64KPLSE2x4SHMwDywFuf73g/fca7nzCcG4RU63bTZJESK01IYDzDqUV3k+NolnMGe6/H/+Zz1C8/W2YEJhdcw365psZd3Zwd30Xf8/dDN/8BsF7xKkdwv334ZVibiA7a3ODg2UHf//ywGvOh/96Eg7MoB4FTzeCbz/l+fULAmOQOOdQSiIA6yw6m81ommYzrU2tvBCCPM8pR0v48peJn3iSNEsx178B96X/YP3hj5BlKSBolrtkf/Eu0vu+z68uf8DRRULZjkghkEBnYWbglpfBm14Eb/gcjF5gA7z6/On1k124cr8ijRTrdU0+n/rGpmmRy+USpRSzPGe5XJEkCXEcsVwumWUpar6g/uEPiZxDFAXL2+9gPs9xUYTVij0HL2T3X/6VxZG7+eh1BhfkmSfXWrjm+YE7fivwpksFH/6+4MgOzKOAIHCihS88GjjeCrTrN83rFvV6jfeeraJAxnE8NYfDQJLEWGux1pLEMcMw4K0lKgpsWfLTf/gov729wwdfMXC8gbWVPL1sQUfcfJVkt/UcbwJGTD1g7+HKfYL9z4OxC9x5LJBpgfWCWMEDpwJffBRyE+jRBKEY+o4oMggBXd+h4zii2wzQ83zOulkDgizLqOsarRVZnPDMbs3vlPfw8dfBegh85rUSIwNtb7l0j+TS/Za//HrCaEdkAs7D3MCtR2ErhsfKwE9riNXGtAJkBvJIcPmewMN1BFLSDx3pLMeO06ihJxIwI0mTaSbJcwKwWi4nR7eWqipJ8i2uOlgTRWtc0Lzhgp4QQCjJM/XIh+/JuOMRz3bk8GEawpWAeoS/u1ugxHQXzzjqJnm2osC1+xVv/dqI9oHFdsHucoUxhq2iQFx44YXhdKGexkQLgNGa0Y4IIacRdBwoneFjrxy4arvnd7+WMzPgxoHH25g3H7K88fyKP/iK5LxM4MKzBGLT3ePO8vtIBh6v4H2/Aoe2FW/6yoy9CfSDxRiD9x47jZ1yM3Z6Tsenm0XvN7OBlDgfmJvAe+9N+LNvRZzqBD9dS45VglRLvnBM8fzc8FdXwxP1VAm0PD2PTC8hpqeqROCJWnD9C+HGiyXv/q4hM4KAwHk/zSsCvPcoJeUtcRyTJDFlWZJlM7RSVFXFfD5RgWa9ZrFYYMeRvu8oVQFjC96xp5jTrmsaJ/n6iZy/vrLjJXvhv58SnOpO8xvwTEdajZP1vO0l8N5r4A+/aniwXWBcy2Adi8WcqqqRUpLPcsQLX/CCMIwDzjqS04VaCJIkpm1blFSYKKJtGkwUobWia1uiOAGg6zrSNAXvWLYj+4uED1275pJi4KvHBN95KnC8BR8EReS5Yh+8/iKJC/DuuzJ+uBuR+gYdp8/Rc9YyjOMGfTiP9x7zHFShJ9wh5QZ9DCilkVIyjiNaawgB6yzGRHjvwTuCMqw6z2sOWH7vF0Yu2w7EcqIVXiieWAs+/5jm9ockSEURC5p+xBgDgLWbO+gmiDXBo2yG2cCe+XwOYcMHN1nctg1FsTXBng0JqKuKACzmE887DY/K1WTwjTecWFactz1jbjxd2yCSBSdqS993HNy3oOsa+uE0jKo2Few0HzRkaYq46KIXhq7rcc4ym+U0/8cHNXEcsa7XxEmM1oa6rsnSFAQ0TUM+y7HW0vU9eZ7T9z3BWeZ5TrVucAjSNKVd1ySRJopjyrKe9JSmXq8nPWDdNOT5pNd3HeLAgQNnW9OmE5sw4xmweSbmWTJwGlqeDR/PQNDn6gmmrAyBM0NX8M+lGGz0ODsmIPuuQwhBZAxd16G1RmtN200lR25AYhzHhM2YmMTJsyUxTRg2YDKO4gluSkEUmalUaYPSmq7riaIIIQT9hr+EEBjGkSRJNmOnI0kSxnEghECSJIhDhw6Fpmmmu7VYUK8nMJnPcsqyRBtDkiSU5Yo0nSjYarUiz3MA6rresGd7FstuJ/Y8X1DVNVIIZvmMclViIkMSJ6w2eloryrLa6AXqesOyh5GmbRH79+8PSimEEFg7opSeXN9twGQIODdBxYkXerTSOOem+V0rrJ2ogZQS5yxSSoSQOGtRSoEAZx1Ka0LwGwPWeO8IAbRWOOsmc1dqwwtBSoU8vdAk7pBSnBVPjeMEFTeg03nUBlL6EM5aKKCUxLkJjaiNhths1jo3zdsInPPTxgN471BS4cP046VSk2VtNivn8zneOdq2ZbFYMPQDw9BviFOD847ZbEZdVygpybKMqqwwkSGKIqqyJE1TlJKs6zV5PsN5T9O2zOdzhr5nHAYWizlN2+K9J5/NqOsapRRpmlFWFVEUE5mIqqom5CEkZVXxv6WhbS36AesIAAAAAElFTkSuQmCC";

window.CUSTOM_SPEED_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAOVElEQVR42q1ZaZRVVXb+9jn33jc/aqAKqIJiKqqgqkEZZBCksKOIsVu77X5ommV3sAlqO3TiUtNZMXm+1pWlvTqrVSIKyYpJlpoOr1s7DgxpBwqXjQiIihSTzEVR1EQNb7jv3nPOzo+qAkpFsJP757771nlnfXefb+/v2/tJXOKVTEI0NoL7nwhzE4lQaE5H1ajp4arymcGS0m+M5Y5PuvIYWJJIQDY1Da7/4y+6lEWJBGQ6Dc3MNPv+ou+EQ/rWcMzMCodohC0paBja9birr5f39HWLlyNq5n80rm7MDP7u/D3+3wEObjznpyPmBGN9T1dPtmZPnOggHrPgWAJEgNGArwxyrsGxEwU07fYOZtrCd21f3fnWlwJLQiAF838GOLj5rHuG3TxyjPfS/IWRQHlpQGsNKMXEDAKDrQALJyjABjCava5u5WzZnDGnT9jf3/50zysNybKoxXr5Arr3mVQqxejnAQEXp4C8GLgrHiieN6LC23Dt4rhdFHO06xppNAQIBAYCERLasz6NF9trC1nktOHacECqMVW2aG7J3hivjb8y5ljn6b4S8cAxs6326LuFxht/XlG7/52+jkuJoLhQZNPrYBp+1BAMOu7zDQ1RGQ5K7bpGCkGg/l/pYFQQjPN26+Fpc24p6/jDitrosnAo+BgstqIh6c27KhIOhHL/mE6TjofL72bWy25/4spYn9e3avHDRZcNJt/XBtiQhASBM9FdN0+ZZtcOL3FUocBSCAIPHAobhpSE+kklj6Zu3PRQbJi/3paH1k+omrDKz1HB9ThQUR7Qo8fKJZetiF/+2t8eOQ3C7kPdn/yJNvw7j9UKANiMPwJgeT0YIISi6nvjxgZYa4YQ5+jKDBCBmRhn4MYAnAADvubDYWhbWhDMzJYkM26SQxQsfBsMIsh3mMw345HY2yDUAcAifHWyfCnA9FJowFAoxJMiIUFanVtHgzgZwnMNN+/PPP4OX7mprzcy5WerZ9+969Chx60A22AyvjKiuFgiHMYMENhy5GdENJoy+gyYbICQukg2WxfIbE4mQdulDJEEDPGQ6A2sEn4eHAirun2fHtrzb0eiW9zciXoDNd7NMBNBMpMOBgQch8oBwIHwfAjhhwNRFPKDLzqQbpceQUYS4hE8gjatm92Mga2ImehsTSIiEASEJPJdGBImrtn/FklvvJs1hqg/zjSwFjAWALhKFQGmx7YRtCyrEWAk0hfhICchuAEWJyEYIAZo/TbYlEqZH7ZFP75ttadX/F1Ozdngs5IEozU85UKxB80+FBeEUobdDLTyyJDoz3EiAhGglIExIg8AhtVskGh+7Wcn9sxP3pc8R6evOGLq54BB43nfbkShkBi31Dnasxw+5NbpLPddYyFowYRDRVwSrCSHhglLOMh63Wju2Ue+KUiCPMsBZoYQxHnXwPNwGAAs4ZRblvwnoA+pR1KXJHWW/4MJ11t+ocaX0ffsyqq9nZ6URa17l8l8z2oIRltRMHVXSWbGpG19NwwLCVESjWNuXTkmjBsLT/koi4xHLFCG3a1vgWHOEooZIEHo6NDw8vJ9ABgZG3PfCw9+kgWAS5Y6Xjb+CpPLPSaMWawU9zGbPptMBYCCF4jeHni5+SUBwpyVIyd7IW9ktrcvGox79z+w/NtXz6ydZLL5gnCsIHad2oiefBuksMHMAIgtm7Bxfbc6tCcyeffzbYfPT8JLNQuCXjyyXb5y+jpMXlRERSU/EVKENJDx48OvC7zc/BKvhG2YaevaU/t2PtW5ed/z/uvdPfKJz5pbYEmLAYJhBWYzRNptG6arx0d7m9my+/n2wwOK8bXA9QMEwImqOrP/3Yeop/NnJKA5MuxG5z8/a+SZsGktfBA4mYRYci8CBEIsYr41trIczMxSWMj6Pch63ZDinLQLQdjblKO+XnoSYDTVf31wACDMj2rH+cr/pWA1Q9jWb0WkbJa97tg7nICknfAHFzY1gTauQqHmz+XUupoRK2ZUV5ts3pWWsNHcsxfK+CAIsGHYjtBtXZ48tM/f9slz2TeQhKjbA25IwsKg9iYhhjxfsFAHoied3x3403MV+DQ4CUGpIelPAJBIJp2T+cf/fdkNC4O2tI1viDpyx9GWOQJLOOB+hQSD8eH2HHKZ8P0AcR1gp1LwAJiB6gik2DSCzcXM7FnScAISbSAsgqHPZVhDElZjSqipd5vVy29ZcNeNc69UvTnP0uxh18n18LQLIgHDjFBIqL0HclbjpsKaHavydyYSLNNp0pf9pLw+GM4si0V4rmWJYl+ZM9ksvef3xv9559pTxy9kYi/qqPvBkaq+nZctXlT9wn1Lb1K5vGdJaWN369voyp2EJR0YY2DbZLr7lHjjv/uOOh11l7+5dmfPyjUr7Y8PvPjYyEr+y/ppQWd4iQ0hGFoT2jsVPtqe6+poCSzf8Uz3q8kkxOe1mS7WKKVSMHV3ROsmjnM++Ps7bw060hYEhw53bcex7t2wZQjMBgQwWdAb1nfLlmPhq3es6mi86aeXFbUHDqRnznOuqa+JwLaF8n0mNkwQYMch05fR9v9s6vVPHXNm7Xq2e3cyCTof5IUJyqCmJtDcv5obKi72f/0XiWsj0WAIzBa1Z4/gePceWCIIZgNmIBgSaueujNV8GA/vWNXRuOTe6ni7s3/DwmuC18yYGvW1Audz2lLKSMMQWrHMZowdi0h/7oKQHYp4jwHETU1Dg3ZBgA2PQKbTQucK255eesOcqXVVY1XO9aWnMzjY+QEESQAMYxjhsPA/3Z+xP97h/WbXs/l/WLlmpd0TbP6vhdeE5taOD/uZjLFBICFowGj036UE8nljlRU7XFKGq6sTI8rSaehEArIhCQs8aN6/pB9pTJGafAd9d/6ciSuWzJ6terI5y5Y2DnXthKdzECQHwanPjubtrY35rePiE5YzAx/te3H1FfMDS2onhP1M1tjnm10AMOfRjJlJCkJxqYxasWw1AKTT0I0pKBDY+rKjTT8CrvtxZcnoit7VP1jSwJ7nC0sE0JE7jvbMUVgyAGMMggFhjhx3rS1vZj91eOTN6dTezPR7Ig/XT8eKaVOiKpszNtFgC0cw0CAISJJQxseA8QEJmGCIpGWpEgC0OFlam9fe8mJZ9NQXIphIQyBFxgqefPi7180aOaqkVBd8JRgGJ3o+BYhgDMO2hWlpK4h3fp/ZT4XyxY2/PN466574g5On4tG5V8SU57Ek6nfgBIBZIWBFMG3kNzGz8gbEA6XQRg+6RpBguF5OAMQa7nP1V+ChXtXzgPh8Q51eCl25LDi6ZlzZHVfW15u+bF46VhBn8i3odTshyQHArJlpxwe5TN/JyoXvPtl8asZ94ccnTdW/WLggro0Skhl0tigPhKl2+DyUhCs4bA9DeXQ8DGvQgAKSIMSDsfaZ946eOLJSNEwaHVKeKtQMAdgACIAQi+SXXjV3SjgSDBk9YJDbs8fA4LMumZlJFdjT4bbvXfU3wXfnzLf+uuGquGYDqY2hQdklEJTxUBGfhPLoaO51u4kEwxL22f6GiGBbAnkPV1nB9l/VTw2yVmQZZWgIB8sHhj3DS0KLp4wfwwVPkRASni6gt9AOggDAYAZJEBY0xEraOr3VI8ptlJU62isYOdDxDXZ+MKxhyzBqyqfz+q3v0283bu+5+8+WDBtTZcMYhrQA32M5bkwQ0+dkfjFqVAgjhzv6eEtBkrTzYkiznoYGWBbHwxOKIlFSWpEgAV/n4Wv3HKkJMIZRWmJhWl1ElRbZ2nXPgcPAXRDB0wVMrZijDza30kuvb3ljz6HsbQdPNoMEGwZDANCaEQ4RFjXEuaY6ZLQGslnNvkuffbHMLKm2bCmDQoizBDZs+o3AgPYMHo1SjFzOWL7PckglIYBIwPXzGFc6xUg9XKz59YYepSYsh2X12JbFhjUPtmGDL1woMBUKLBgQbacV5V3xnhhSYADCxoNeNu92FXy/vyNjhiND59zK+Z0dEfqL7/nCSRAkUfDzKI+O4Ykls8zq9Kt05GjvDz9adbg96qhwoaBIkE18dobUv58kAUvCuJ7iluO6WbVWbBZfGHlAcFtX9oNjrac55DhGs0bQiqA4VAFlvAEeDvZGfB4ygiABZoOcl0HFsIk8tWKRWfPKBmvHxyfv2f+v4lVmQ24WH+8/0uzGnHKE7Ch72gUDMMbAVS6isaA6fkyIjk6zav+r+/uGTLdml4OamsDhenlK6dzKBZfXGaWZAFAsMBxn8ifhqgyksM5J1kAEGAa+9kBkYVrlPD0qWi+e+c3rYvPWQw8cWCueakgaa307aMej1GvV9lWVjxg2q6F+rp/xusGkORIMm8rSsbq1JeD8ftOpbcX+qDuXXd/FQwA2NYETCcj3XuSTXNVTakV53uwpNX7eLQhBNpVFqqBMAa7KQLMPbRR4QLYCMoKqkslmVtXVuusMWb964RX3w90tP96/VjzXkDRWYwqqaV2//s/m2s1b9+6a5THXTBwxRRQFK4VQpWLHR51yw1v73jRZ/v7bq1p7GxedY89QC5aAWJdYhyf+cOu6m66bcfNN869EJBhSnm+E1kQZrwsZrwtKFxCwAxwPFXM8WILurCs3bfsAG7Z8uK2vHXfv/he9cxDc50crzExT7qTbSosD10fD4bKc67ac7sy/fnCNWMcwZ0cidMHJKwNCCP7GXSZZWz3ywWsXTItMHjcGReEoAnYQgiS00cgV8jjZ2YEdew7i/V0HDh891fPkreXJZ1OplPoKKz9YjIbk59nP581r6OLjYcE1K8z4cAS3lRUPu66sODoxHAzECaC877ld3ZmWzp7Mjs4z6rVs66j1p15vzQGML3PHn98/sa4/4+r2gAe6PqSXwnyt7i+RGBwT99fF2HdQGk+gOnYLakpvRUX/GPmc5jYkYV3qvweXcv0vZRcYcuc9W9YAAAAASUVORK5CYII=";

window.CUSTOM_SPEED_SWITCH_ICON =
  "data:image/png;base64,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";

window.CUSTOM_SPEED_ICON =
  "data:image/png;base64,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";

window.CUSTOM_SPEED_SWITCH_ICON =
  "data:image/png;base64,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";

window.remixDrawCustomSpeedIcon = function remixDrawCustomSpeedIcon() {
  return window.CUSTOM_SPEED_ICON;
};

window.remixDrawSpeedSwitcherIcon = function remixDrawSpeedSwitcherIcon() {
  return window.CUSTOM_SPEED_SWITCH_ICON;
};

window.remixInjectCustomSpeedSettingsUi = function remixInjectCustomSpeedSettingsUi() {
  const panel = document.getElementById("remix-custom-panel-speeds");
  if (!panel) return;
  window.remixEnsureCustomSpeedSettings();
  let card = document.getElementById("remix-custom-speeds-card");
  if (!card) {
    card = document.createElement("div");
    card.id = "remix-custom-speeds-card";
    card.className = "remix-custom-card";
    card.innerHTML =
      '<div class="remix-custom-title">Custom speed</div>' +
      '<div class="remix-custom-hint">Multiplier (lower = faster). Clamp 0.00001–18.5</div>' +
      '<label>Mult <input id="remix-custom-speed-mult" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      '<div class="remix-custom-title" style="margin-top:10px;">Speed switcher</div>' +
      '<div class="remix-custom-hint">Flips A↔B every apple eaten</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">' +
      '<label>A <input id="remix-custom-speed-a" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      '<label>B <input id="remix-custom-speed-b" type="number" min="0.00001" max="18.5" step="0.01" /></label>' +
      "</div>";
    panel.appendChild(card);

    function commit() {
      const m = document.getElementById("remix-custom-speed-mult");
      const a = document.getElementById("remix-custom-speed-a");
      const b = document.getElementById("remix-custom-speed-b");
      if (!m || !a || !b) return;
      window.pudding_settings.CustomSpeedMult = Number(m.value);
      window.pudding_settings.CustomSpeedA = Number(a.value);
      window.pudding_settings.CustomSpeedB = Number(b.value);
      window.remixEnsureCustomSpeedSettings();
      m.value = String(window.pudding_settings.CustomSpeedMult);
      a.value = String(window.pudding_settings.CustomSpeedA);
      b.value = String(window.pudding_settings.CustomSpeedB);
      if (typeof window.saveSettings === "function") window.saveSettings();
    }
    ["remix-custom-speed-mult", "remix-custom-speed-a", "remix-custom-speed-b"].forEach(
      function (id) {
        document.getElementById(id).addEventListener("change", commit);
      }
    );
  }
  document.getElementById("remix-custom-speed-mult").value = String(
    window.pudding_settings.CustomSpeedMult
  );
  document.getElementById("remix-custom-speed-a").value = String(
    window.pudding_settings.CustomSpeedA
  );
  document.getElementById("remix-custom-speed-b").value = String(
    window.pudding_settings.CustomSpeedB
  );
};

window.CustomSpeeds.runCodeBefore = function () {
  window.remixEnsureCustomSpeedSettings();
  window.uiImage =
    window.uiImage ||
    function (src) {
      const img = new Image();
      img.src = src;
      img.width = 40;
      img.height = 40;
      img.classList.add("DqMRee");
      img.classList.add("SsAred");
      return img;
    };

  const speedRoot = document.querySelector("#speed");
  if (!speedRoot) {
    window.CUSTOM_SPEED_INDEX =
      typeof window.CAT_SPEED_INDEX === "number" ? window.CAT_SPEED_INDEX + 1 : 15;
    window.CUSTOM_SPEED_SWITCH_INDEX = window.CUSTOM_SPEED_INDEX + 1;
    return;
  }
  if (window._customSpeedsIconsInserted) {
    if (typeof window.CUSTOM_SPEED_INDEX !== "number") {
      window.CUSTOM_SPEED_INDEX = speedRoot.children.length - 2;
      window.CUSTOM_SPEED_SWITCH_INDEX = speedRoot.children.length - 1;
    }
    return;
  }

  const custom = window.uiImage(window.remixDrawCustomSpeedIcon());
  custom.alt = "Custom Speed";
  speedRoot.appendChild(custom);
  window.CUSTOM_SPEED_INDEX = [...speedRoot.children].indexOf(custom);

  const sw = window.uiImage(window.remixDrawSpeedSwitcherIcon());
  sw.alt = "Speed Switcher";
  speedRoot.appendChild(sw);
  window.CUSTOM_SPEED_SWITCH_INDEX = [...speedRoot.children].indexOf(sw);
  window._customSpeedsIconsInserted = true;

  if (window.speed_img_arr) {
    window.speed_img_arr = Array.from(speedRoot.children).map(function (el) {
      return el.src;
    });
  }
  if (!window.speedToTxt) window.speedToTxt = {};
  window.speedToTxt[window.CUSTOM_SPEED_INDEX] = { name: "Custom" };
  window.speedToTxt[window.CUSTOM_SPEED_SWITCH_INDEX] = { name: "Switcher" };

  if (typeof window.HandleSpeed === "function" && !window.HandleSpeed.__customSpeedsPatched) {
    const orig = window.HandleSpeed;
    window.HandleSpeed = function (speed) {
      if (speed === window.CUSTOM_SPEED_INDEX) return "Custom speed, ";
      if (speed === window.CUSTOM_SPEED_SWITCH_INDEX) return "Speed switcher, ";
      return orig(speed);
    };
    window.HandleSpeed.__customSpeedsPatched = true;
  }
};

window.CustomSpeeds.alterSnakeCode = function (code) {
  const customIdx =
    typeof window.CUSTOM_SPEED_INDEX === "number" ? window.CUSTOM_SPEED_INDEX : 15;
  const switchIdx =
    typeof window.CUSTOM_SPEED_SWITCH_INDEX === "number"
      ? window.CUSTOM_SPEED_SWITCH_INDEX
      : customIdx + 1;

  const tickCustom =
    "case " +
    customIdx +
    ":\\s*speedMultiplier\\s*=\\s*window\\.remixCustomSpeedMult";
  const tickSwitch =
    "case " +
    switchIdx +
    ":\\s*speedMultiplier\\s*=\\s*window\\.remixCustomSpeedSwitcherMult";

  if (!new RegExp(tickCustom).test(code)) {
    const tickDefault =
      /default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?/;
    const tickCase =
      `case ${customIdx}:
              speedMultiplier = window.remixCustomSpeedMult()
              break
            case ${switchIdx}:
              speedMultiplier = window.remixCustomSpeedSwitcherMult()
              break
            default:
              speedMultiplier = 1
              break`;
    const tickSwitchBlock = code.match(
      /let speedMultiplier\s*;?\s*switch\([\s\S]{0,80}?\)\s*\{[\s\S]*?default:\s*speedMultiplier\s*=\s*1\s*;?\s*break\s*;?\s*\}/
    );
    if (tickSwitchBlock) {
      const body = tickSwitchBlock[0].replace(tickDefault, tickCase);
      code = code.assertReplace(tickSwitchBlock[0], body);
    } else if (tickDefault.test(code)) {
      code = code.replace(tickDefault, tickCase);
    } else {
      console.error("CustomSpeeds: failed to inject tick cases");
    }
  }

  if (!new RegExp("case\\s+" + customIdx + ":\\s*a\\s*=\\s*window\\.remixCustomSpeedMult").test(code)) {
    const resetDefault = /default:\s*a\s*=\s*1[\s\S]*?break a/;
    const resetCase =
      `case ${customIdx}:
            a = window.remixCustomSpeedMult()
            break a
          case ${switchIdx}:
            a = window.remixCustomSpeedSwitcherMult()
            break a
          default:
            a = 1
            break a`;
    const resetSwitch = code.match(
      /case 1:\s*a\s*=\s*\.66[\s\S]*?default:\s*a\s*=\s*1[\s\S]*?break a\s*\}/
    );
    if (resetSwitch) {
      const rb = resetSwitch[0].replace(resetDefault, resetCase);
      code = code.assertReplace(resetSwitch[0], rb);
    } else if (resetDefault.test(code)) {
      code = code.replace(resetDefault, resetCase);
    } else {
      console.error("CustomSpeeds: failed to inject reset cases");
    }
  }

  // Flip A↔B when score increases (apple eaten). Current builds don't
  // keep a stable `a.Sh++` token in tick, so detect Sh deltas at tick start.
  if (code.indexOf("window.remixOnAppleEatenSpeedSwitch") < 0) {
    const tickHead = code.match(/tick\(\)\s*\{\s*window\.__remixGame\s*=\s*this\s*;/);
    if (tickHead) {
      code = code.assertReplace(
        tickHead[0],
        tickHead[0] +
          "if(window.__remixLastSh!=null&&this.Sh>window.__remixLastSh){window.remixOnAppleEatenSpeedSwitch();}window.__remixLastSh=this.Sh;"
      );
    } else if (code.indexOf("a.Sh++;") >= 0) {
      code = code.replace(/a\.Sh\+\+;/g, "a.Sh++;window.remixOnAppleEatenSpeedSwitch();");
    } else {
      console.error("CustomSpeeds: failed to find apple eat / tick head hook");
    }
  }

  // Reset switcher state when game resets (inside case 1 body — not between cases).
  if (code.indexOf("window.remixResetSpeedSwitchState") < 0) {
    const resetSpeedHead = code.match(/case 1:\s*a\s*=\s*\.66/);
    if (resetSpeedHead) {
      code = code.assertReplace(
        resetSpeedHead[0],
        "case 1: window.remixResetSpeedSwitchState(); window.__remixLastSh=null; a = .66"
      );
    }
  }

  return code;
};
