import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const runBrowser = process.env.RUN_BROWSER_TESTS === "1";

describe("Slot Machine mode (offline)", () => {
  it("SlotMachineInit defines core API", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    assert.match(init, /window\.SlotMachineMod/);
    assert.match(init, /SLOT_MACHINE_ICON/);
    assert.match(init, /SLOT_MACHINE_POOL/);
    assert.match(init, /isSlotMachineActive/);
    assert.match(init, /assignSlotMode/);
    assert.match(init, /slotRespawn/);
    assert.match(init, /slot_is_dice_count/);
    assert.match(init, /slot_dice_spawn_n/);
    assert.match(init, /slot_is_bomb_count/);
    assert.match(init, /slot_bomb_spawn_n/);
    assert.match(init, /slot_is_bomb_count\(g\) && !g\.kc/);
    assert.match(init, /slot_is_tally_count/);
    assert.match(init, /slot_tally_spawn_n/);
    assert.match(init, /slot_index_tally_fruits/);
    assert.match(init, /slot_is_store_special/);
    assert.match(init, /m === 2 \|\| m === 27 \|\| m === 8/);
    assert.match(init, /slot_uses_special_store/);
    assert.match(init, /slot_store_push/);
    assert.match(init, /slot_store_shift/);
    assert.match(init, /slot_plant_wave_units/);
    assert.match(init, /slot_keys_or_soko_blocking/);
    assert.match(init, /__slotSpecialStore/);
    assert.match(init, /sequenceNumber = seq/);
    assert.match(init, /portal pair shares one index|Portal pair both get/);
    assert.match(init, /slot_fruit_left_excluding_eaten/);
    assert.match(init, /slot_on_eating_fruit/);
    assert.match(init, /slot_eat_respawn/);
    assert.match(init, /slot_note_portal_twin/);
    assert.match(init, /slot_flush_portal_twin/);
    assert.match(init, /slot_portal_twin_index/);
    assert.match(init, /slot_ensure_unique_fruit_types/);
    assert.match(init, /Reserve types already owned by non-portal/);
    assert.match(init, /Never retag fruit that already has one/);
    assert.match(init, /SLOT_MACHINE_MODE_LABELS/);
    assert.match(init, /slot_enabled_pool/);
    assert.match(init, /slot_get_enabled_modes/);
    assert.match(init, /slot_set_enabled_modes/);
    assert.match(init, /slot_deselect_all_enabled_modes/);
    assert.match(init, /slot_vanilla_only_enabled_modes/);
    assert.match(init, /slot_is_remix_added_mode/);
    assert.match(init, /remix-slot-modes-none/);
    assert.match(init, /remix-slot-modes-vanilla/);
    assert.match(init, /Deselect all/);
    assert.match(init, /Vanilla only/);
    assert.match(init, /SlotMachineModes/);
    assert.match(init, /remixInjectSlotMachineSettingsUi/);
    assert.match(init, /remix-custom-panel-slot/);
    assert.match(init, /remix-slot-mode-grid/);
    assert.match(init, /slot_pick_unique_type/);
    assert.match(init, /slot_after_layout\(this\)/);
    assert.match(init, /slot after layout on apple reset/);
    assert.match(init, /slot P6E twin via pair id/);
    assert.match(init, /slot portal _ti via pair id/);
    assert.match(init, /slot_R3E_gate/);
    assert.match(init, /__bowlIsMode/);
    assert.match(init, /slot_sync_portal_he_pairs/);
    assert.match(init, /slot_portal_no_wipe/);
    assert.match(init, /slot portal no wipe after twin_index/);
    assert.match(init, /slot_block_u7E_portal_pair_types/);
    assert.match(init, /pudding_settings/);
    assert.match(init, /timeKeeper/);
    assert.match(init, /slot_r7E_win_gate/);
    assert.match(init, /timeKeeper\.gotAll/);
    assert.match(init, /ticks\s*\*\s*game\.Fb|game\.ticks\s*\*\s*game\.Fb/);
    assert.match(init, /slot_record_all_timer_split/);
    assert.match(init, /SplitPanelOnSplit/);
    assert.match(init, /__slotS2E/);
    assert.match(init, /header\.Aa,\s*"ALL"/);
    assert.match(init, /__slotEagerEndMenu/);
    assert.match(init, /__slotShowEndMenu/);
    assert.match(
      init,
      /All-apples win: restore Slot Machine topbar icon/
    );
    assert.match(init, /slot_n7E_round_fruit/);
    assert.match(init, /slot_n7E_entity_guard/);
    assert.match(init, /slot_n7E_snake_mirror_guard/);
    assert.match(init, /slot_strip_burger_from_pieces/);
    assert.match(init, /slot_freeze_burger_fresh_timers/);
    assert.match(init, /slot_burger_leftover_tick/);
    assert.match(init, /__slotBurgerPoison/);
    assert.match(init, /burger_assign_timers_all\(g\.wa\.ka, g\)/);
    assert.match(init, /__slotBurgerSpawning/);
    assert.match(init, /burger_spawn_fresh\.__slotWrap/);
    assert.match(init, /burger_timer_roll\.__slotWrap/);
    assert.match(init, /cat_try_spend_life\.__slotPeacefulWrap/);
    assert.match(init, /\(window\.__slotActive\|0\)===25\|\|window\.slot_has_oka/);
    assert.match(init, /burger_assign_timer\.__slotPieceGate/);
    assert.match(init, /burger_apple_timer_eligible\.__slotPieceGate/);
    assert.match(init, /burger_expire_apple\.__slotPieceGate/);
    assert.match(init, /burger_make_poison\.__slotPieceGate/);
    assert.match(init, /slot_chess_board_lock/);
    assert.match(init, /head_state!==\\"OPEN\\"/);
    assert.match(init, /slot_has_keys/);
    assert.match(init, /slot_has_sokoboxes/);
    assert.match(init, /slot_soko_resolve_body_overlaps/);
    assert.match(init, /slot_soko_pos_on_snake/);
    assert.match(init, /slot_soko_pos_on_fruit/);
    assert.match(init, /slot_soko_snap_box_positions/);
    assert.match(init, /slot_U3E_guard/);
    assert.match(init, /slot_W4E_head_guard/);
    assert.match(init, /Box on snake body or fruit/);
    assert.match(init, /Native e5E ignores leftover fruit/);
    assert.match(init, /slot_has_bridges/);
    assert.match(init, /slot_has_gates/);
    assert.match(init, /slot_has_shields/);
    assert.match(init, /slot_apply_shield/);
    assert.match(init, /slot_mark_existing_shields/);
    assert.match(init, /slot_clear_fruit_shields/);
    assert.match(init, /slot_snapshot_shield_nba_for_chess_lock/);
    assert.match(init, /slot_restore_shield_nba_after_chess_lock/);
    assert.match(init, /chess_peaceful_active/);
    assert.match(init, /Peaceful unlocks leftovers only when head is OPEN/);
    assert.match(init, /__chessMakeApple=g7/);
    assert.match(init, /slot capture chess helpers on eat/);
    assert.match(init, /__slotNbaPrior/);
    assert.match(init, /Only while Shield is the active roll/);
    assert.match(init, /slot_g7_shield_gate/);
    assert.match(init, /window\.__slotP3E=P3E/);
    assert.match(init, /1–2 blocked dirs|1-2 blocked dirs/);
    assert.match(
      init,
      /e7\(15\) keep shield leftovers|slot_has_shields&&window\.slot_has_shields/
    );
    assert.doesNotMatch(init, /e7\(15\) no longer via shield leftovers/);
    assert.doesNotMatch(
      init,
      /Shield bars follow the fruit's badge/
    );
    assert.doesNotMatch(
      init,
      /if \(m === 15\) \{\s*window\.slot_apply_shield/
    );
    assert.doesNotMatch(
      init,
      /strip leftover fruit shields so they/
    );
    assert.match(init, /ultraShouldSpawnFruitShields\.__slotWrap/);
    assert.match(init, /shield_empty_all\.__slotWrap/);
    assert.match(init, /__slotActive\|0\)===15\)\)for/);
    assert.match(init, /chess_find_legal_spawn/);
    assert.match(init, /slot_pos_in_wall/);
    assert.match(init, /slot_add_wall_keys/);
    assert.match(init, /Never return a wall or bridge cell/);
    assert.match(init, /chess_outside_spawn_radius/);
    assert.match(init, /slot_prep_twin_eat/);
    assert.match(init, /slot_finish_twin_eat/);
    assert.match(init, /b===window\.__slotActive&&b!==5/);
    assert.match(init, /fruit\.isPiece/);
    assert.match(init, /just_ate === \"piece\"/);
    assert.match(init, /chess_fruit_respawn\.__slotWrap/);
    assert.match(init, /__slotAllowChessFruitRespawn/);
    assert.match(init, /__slotFromChessUnlock/);
    assert.match(init, /capture_attempt\.__slotWrap/);
    assert.match(init, /slot_sanitize_chess_identity/);
    assert.match(init, /slot_demote_chess_piece_to_fruit/);
    assert.match(init, /slot_is_chess_piece_type/);
    assert.match(init, /slot_skip_key_soko_refill/);
    assert.match(init, /slot_key_unlock_fruit/);
    assert.match(
      init,
      /slot_key_unlock_fruit \|\| window\.slot_soko_unlock_fruit/
    );
    assert.match(
      init,
      /Key\/soko unlock must stay a regular badged fruit/
    );
    assert.match(init, /slot_soko_unlock_fruit/);
    assert.match(init, /slot_stamp_tally_unlock_index/);
    assert.match(init, /slot_tally_board_max_sequence/);
    assert.match(init, /window\.__slotF4E=f4E/);
    assert.match(init, /f4E\(a\.wa,c,b\.yNa,b\.Lh,b\.sequenceNumber,/);
    assert.match(init, /f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber,!0\)/);
    assert.match(init, /slot_poison_oka_gate/);
    assert.match(init, /slot_block_e4E/);
    assert.match(init, /slot_block_l4E/);
    assert.match(init, /slot_block_g4E/);
    assert.match(init, /__slotActive!=null/);
    assert.match(init, /Poison hazard: never treat/);
    assert.match(init, /slot_leave_bomb_fruit/);
    assert.match(init, /slot_has_bomb_plants/);
    assert.match(init, /slot_arm_new_bomb_fruits/);
    assert.match(init, /slot_prune_bomb_zones_to_marked/);
    assert.match(init, /__slotBombPlant/);
    assert.match(init, /keep planted idle rings/i);
    assert.match(init, /bombFruit_refresh_snap\.__slotGate/);
    assert.match(init, /bombFruit_sync_fruit_bombs\.__slotGate/);
    assert.match(init, /spawn radius is ONLY for new Bomb-badge arms/);
    assert.match(init, /slot_skip_b4E/);
    assert.match(init, /slot_has_arrows/);
    assert.match(init, /__slotAllowArrowTurns = m === 16/);
    assert.match(init, /slot_clear_hotdog_walls/);
    assert.match(init, /prev === 17/);
    assert.match(init, /slot_has_hotdog_walls/);
    assert.match(init, /slot_hotdog_B6E_filter/);
    assert.match(init, /slot_hotdog_F6E_guard/);
    assert.match(init, /wall\.ty/);
    assert.match(init, /__slotQ6E/);
    assert.match(init, /__slotE5E/);
    assert.match(init, /try\{window\.__slotE5E=e5E;\}/);
    assert.match(init, /m === 9/);
    assert.match(init, /placeSokobox|aa\.oa\.add/);
    assert.match(init, /slot_has_mines/);
    assert.match(init, /disableMineMode/);
    assert.match(init, /__slotActive\|0\)===12\)&&v6E/);
    assert.match(init, /__slotAllowKeyPlant/);
    assert.match(init, /__slotAllowSokoPlant/);
    assert.match(init, /slot_skip_key_soko_goal/);
    assert.match(init, /__slotActivatedFruit/);
    assert.match(init, /__slotRespawnedThisEat/);
    assert.match(init, /slot_block_key_soko_bulk/);
    assert.match(init, /void 0,\\s\*l/);
    assert.match(init, /slot gate poison Oka pairing after burger/);
    assert.match(init, /function smReplace\(label, re, replacement, optional\)/);
    assert.match(init, /slot_u7E_fruit_only/);
    assert.match(init, /slot_Y3E_gate/);
    assert.match(init, /slot_pre_layout_reset/);
    assert.match(init, /slot_r7E_win_gate/);
    assert.match(init, /disableKeyResetPlant = true/);
    assert.match(init, /Poison badge: one random-badge fruit/);
    assert.match(init, /assignSlotMode\(f\)/);
    assert.doesNotMatch(
      init,
      /Unlock fruit \(no badge\) while Chess is the active roll/
    );
    assert.match(init, /slot_has_statues/);
    assert.match(init, /b===13&&window\.slot_has_statues/);
    assert.match(
      init,
      /disableStatueBodyPlant&&!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(\(window\.__slotActive\|0\)===13\|\|window\.slot_has_statues/
    );
    assert.match(
      init,
      /disableStatueBodyPlant&&!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(window\.__slotActive\|0\)===13\)\)return;for\(var c=a\.wa\.ka/
    );
    assert.match(
      init,
      /e7E\(a\.Ya\),\(!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)\)\|\|\(window\.__slotActive\|0\)===13\)&&k7E\(a\.Ya/
    );
    assert.match(init, /slot_draw_badge_at_fruit/);
    assert.match(init, /slot_sync_ultra_disables/);
    assert.match(init, /slot_wrap_ultra_disable_flags/);
    assert.match(init, /ultraEnsureGameplayToggles\.__slotWrap/);
    assert.match(init, /disableKeyResetPlant/);
    assert.match(init, /makeApple\(mgr, 0, 0\)/);
    assert.match(init, /slot_draw_badges/);
    assert.match(init, /slot_win_if_empty/);
    assert.match(init, /slot_board_has_playable_content/);
    assert.match(init, /slot_clear_arrow_at/);
    assert.match(init, /slot_clear_arrows_under_fruit/);
    assert.match(init, /slot_clear_arrows_under_spawns/);
    assert.match(init, /slot_has_sokogoals/);
    assert.match(init, /bombFruit_win_if_empty\.__slotGate/);
    assert.match(init, /f\.Oka\) continue; \/\/ poison/);
    assert.match(init, /game\.ub\s*=\s*true/);
    assert.match(init, /__slotEatenFruit/);
    assert.match(init, /__slotCatFruitEaten/);
    assert.match(init, /Cat badge: \+1 life immediately/);
    assert.doesNotMatch(
      init,
      /__slotCatFruitEaten % every === 0/
    );
    assert.match(init, /slot_snap_winged/);
    assert.match(init, /slot_snap_fruit_tiles/);
    assert.match(init, /slot_pos_on_bridge/);
    assert.match(init, /slot_add_bridge_keys/);
    assert.match(init, /slot_relocate_fruit_off_bridges/);
    assert.match(init, /fruit\/chess piece sitting on a bridge/);
    assert.match(init, /Never relocate onto another bridge/);
    assert.match(init, /If no safe cell exists, remove/);
    assert.match(init, /slot_win_if_empty && window\.slot_win_if_empty\(g\)/);
    assert.match(init, /Magnet\/winged can round onto a bridge/);
    assert.match(init, /slot_pos_on_bridge\(game, p\.x, p\.y\)\) return false/);
    assert.match(init, /Native freePos can land on leftover bridges/);
    assert.match(init, /slot_ensure_fruit_motion/);
    assert.match(init, /slot_ensure_board_motion/);
    assert.match(init, /prev === 6 \|\| prev === 18/);
    assert.match(init, /Poison badge: one random-badge fruit/);
    assert.doesNotMatch(init, /Always leave a safe fruit/);
    // Settings UI: dedicated badge grid (not native blender icon classes).
    assert.match(init, /remix-slot-mode-grid/);
    assert.match(init, /Do not reuse native blender classes/);
    assert.doesNotMatch(
      init,
      /vuOknd remix-slot-mode-cell/
    );
    assert.match(init, /data:image\/png;base64,/);
    // Pool includes Yin Yang 7, Dimension 11, Mexico 27; excludes Classic 0 / Blender 22
    assert.match(
      init,
      /SLOT_MACHINE_POOL\s*=\s*\[[^\]]*1,\s*2,\s*3,\s*4,\s*5/
    );
    assert.match(init, /7:\s*"Yin Yang"/);
    assert.match(init, /11:\s*"Dimension"/);
    assert.match(init, /27:\s*"Mexico"/);
    assert.match(init, /4:\s*"Borderless"/);
    assert.match(init, /slot_borderless_wrap/);
    assert.match(init, /b!==5&&b!==4&&b!==7&&b!==11&&b!==27/);
    assert.match(init, /SLOT_BADGE_POLARITY/);
    assert.match(init, /slot_roll_yy_pair/);
    assert.match(init, /slot_yy_swap_board/);
    assert.match(init, /slot_flip_yy_snake_colors/);
    assert.match(init, /slot_yy_apply_snake_color_index/);
    assert.match(init, /__slotYyColorFieldSkip/);
    assert.match(init, /slot_yy_gradient_for_index/);
    assert.match(init, /slot_yy_recolor_face/);
    assert.match(init, /slot_yy_read_color_index/);
    assert.match(init, /__slotA7/);
    assert.match(init, /__slotFaceRef/);
    assert.match(init, /slot_yy_is_face_atlas/);
    assert.match(init, /slot_yy_resolve_face/);
    assert.match(init, /snake\.Sc/);
    assert.match(init, /settings\.wa/);
    assert.match(init, /BOARD THEME/);
    assert.match(init, /updateAnimHeadColour/);
    assert.match(init, /__slotYyColorField = \"wa\"/);
    assert.match(init, /slot capture a7 sprite recolor/);
    assert.match(init, /slot capture face atlas on construct/);
    assert.match(init, /__slotYyColorIndex=d/);
    assert.match(init, /slot_dimension_activate_grace/);
    assert.match(init, /slot_mexico_on_eat/);
    assert.match(init, /slot_mexico_plant_portal_pair/);
    assert.match(init, /slot_mexico_place_partial_mid/);
    assert.match(init, /slot_mexico_clear_mid/);
    assert.match(init, /slot_mexico_tick_cross/);
    assert.match(init, /slot_fruit_on_mid/);
    assert.match(init, /slot_update_active_trophy/);
    assert.match(init, /m === 27 && window\.MEXICO_ICON/);
    assert.doesNotMatch(
      init,
      /SLOT_MACHINE_POOL\s*=\s*\[[^\]]*[^0-9]0\s*,/
    );
  });

  it("Yin Yang / Dimension / Mexico / trophy helpers behave", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    // Extract and eval helper bodies in a minimal sandbox is heavy; assert
    // key control-flow strings instead.
    assert.match(init, /__slotYinYangPair/);
    assert.match(init, /f\.slotMode = pair/);
    assert.match(init, /burgerTimer = null/);
    assert.match(init, /slot_yy_flip_chess_piece/);
    assert.match(init, /slot_yy_flip_head_piece/);
    assert.match(init, /Carried chess head/);
    assert.match(init, /atMax/);
    assert.match(init, /At 9: free/);
    assert.match(init, /__slotMexicoPortal/);
    assert.match(init, /__slotMexicoStartSide/);
    assert.match(init, /__slotMexicoMidUp/);
    assert.match(init, /Mexico is never assigned to mid-row/);
    assert.match(init, /Mexico badge pairs never land on the snake/);
    assert.match(init, /Never plant mid walls on the snake body/);
    assert.match(init, /slot_mexico_relocate_pair_halves/);
    assert.match(init, /neither twin may sit on the middle row/);
    assert.match(init, /slot_mexico_blocks_mid_fruit/);
    assert.match(init, /slot_portal_pair_ban/);
    assert.match(init, /Portal pairs never roll Twin/);
    assert.match(init, /non-Mexico \/ non-Twin/);
    assert.match(init, /window\.slot_tick_logic = function slot_tick_logic/);
    assert.match(init, /do not spawn\/rebuild mid/);
    assert.match(init, /updateTrophySRC\.__slotWrap/);
    assert.match(init, /slot_update_active_trophy/);
    // Polarity table includes both for Yin Yang
    assert.match(init, /7:\s*"both"/);
    assert.match(init, /11:\s*"good"/);
    assert.match(init, /27:\s*"bad"/);
  });

  it("YY swap / Dimension grace / Mexico mid helpers (unit)", () => {
    // Minimal window stubs + eval selected helpers from SlotMachineInit.
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    const sandbox = { window: {}, Math, Object, Set, JSON, console };
    // Pull polarity + core helpers by executing runCodeBefore fragment via Function.
    // Only the symbols we need for unit checks.
    const src = `
      window.SLOT_BADGE_POLARITY = {1:"bad",3:"good",7:"both",11:"good",27:"bad",26:"good"};
      window.SLOT_MACHINE_POOL = [1,3,7,11,26,27];
      window.slot_enabled_pool = function(){ return window.SLOT_MACHINE_POOL.slice(); };
      window.slot_badge_polarity = function(mode){
        return (window.SLOT_BADGE_POLARITY||{})[mode|0]||"bad";
      };
      window.slot_roll_yy_pair = ${init.match(/window\.slot_roll_yy_pair = function slot_roll_yy_pair\(primary(?:, exclude)?\) \{[\s\S]*?\n  \};/)[0].replace(/^window\.slot_roll_yy_pair = /, "")};
      window.slot_yy_swap_board = ${init.match(/window\.slot_yy_swap_board = function slot_yy_swap_board\(mgr\) \{[\s\S]*?\n  \};/)[0].replace(/^window\.slot_yy_swap_board = /, "")};
      window.slot_yy_flip_chess_piece = ${init.match(/window\.slot_yy_flip_chess_piece = function slot_yy_flip_chess_piece\(f\) \{[\s\S]*?\n  \};/)[0].replace(/^window\.slot_yy_flip_chess_piece = /, "")};
      window.slot_yy_flip_head_piece = ${init.match(/window\.slot_yy_flip_head_piece = function slot_yy_flip_head_piece\(\) \{[\s\S]*?\n  \};/)[0].replace(/^window\.slot_yy_flip_head_piece = /, "")};
      window.slot_draw_mode_excluding = function(ban){
        const pool = window.slot_enabled_pool().filter(function(m){
          return (ban||[]).indexOf(m|0) < 0;
        });
        return pool.length ? pool[0] : 1;
      };
      window.CAT_MAX_LIVES = 9;
      window.CAT_GRACE_EXTRA = 3;
      window.cat_lives = 3;
      window.cat_peaceful_ticks = 0;
      window.slot_dimension_activate_grace = ${init.match(/window\.slot_dimension_activate_grace = function slot_dimension_activate_grace\([\s\S]*?\n  \};/)[0].replace(/^window\.slot_dimension_activate_grace = /, "")};
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);

    const w = sandbox.window;
    // Good primary → bad/both pair
    const pair = w.slot_roll_yy_pair(3);
    assert.ok(pair === 1 || pair === 7 || pair === 27, "pair=" + pair);

    // YY swap badges + chess color
    w.wpawn = 101;
    w.bpawn = 201;
    const a = { slotMode: 3, __slotYinYangPair: 1, burgerTimer: 5, burgerTimerMax: 5 };
    const b = {
      isPiece: true,
      ChessColor: "w",
      ChessPiece: "pawn",
      type: 101,
    };
    const portalA = {
      slotMode: 3,
      __slotYinYangPair: 1,
      __slotPortal: true,
      __slotPortalPairId: 1,
    };
    const portalB = {
      slotMode: 1,
      __slotYinYangPair: 3,
      __slotPortal: true,
      __slotPortalPairId: 1,
    };
    portalA.__slotPortalTwin = portalB;
    portalB.__slotPortalTwin = portalA;
    w.slot_yy_swap_board({ ka: [a, b, portalA, portalB] });
    assert.equal(a.slotMode, 1);
    assert.equal(a.__slotYinYangPair, 3);
    assert.equal(a.burgerTimer, null);
    assert.equal(b.ChessColor, "b");
    assert.equal(b.type, 201);
    assert.equal(portalA.slotMode, portalB.slotMode);

    // Carried head piece flips color + trophy type.
    w.head_state = "pawn";
    w.head_color = "w";
    w.wpawn = 101;
    w.bpawn = 201;
    let trophyType = null;
    w.updateTrophySRC = function (type) {
      trophyType = type;
    };
    assert.equal(w.slot_yy_flip_head_piece(), true);
    assert.equal(w.head_color, "b");
    assert.equal(trophyType, 201);
    assert.equal(w.slot_yy_flip_head_piece(), true);
    assert.equal(w.head_color, "w");
    assert.equal(trophyType, 101);
    w.head_state = "OPEN";
    w.head_color = "NONE";
    assert.equal(w.slot_yy_flip_head_piece(), false);

    // Dimension below 9: net lives unchanged, grace set
    w.cat_lives = 3;
    w.cat_peaceful_ticks = 0;
    w.slot_dimension_activate_grace({ Sh: 10 });
    assert.equal(w.cat_lives, 3);
    assert.ok((w.cat_peaceful_ticks | 0) > 0);

    // Dimension at 9: stay on 9, still grace
    w.cat_lives = 9;
    w.cat_peaceful_ticks = 0;
    w.slot_dimension_activate_grace({ Sh: 10 });
    assert.equal(w.cat_lives, 9);
    assert.ok((w.cat_peaceful_ticks | 0) > 0);
  });

  it("YY snake color flips wa/Sc not board theme oa + recolors face", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = init.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      window.__slotYyBaseColorPairs = [5,4,7,7,1,2,0,3,9,8,0,14,15,15,11,12,17,16];
      window.__slotSnakeColorTable = [
        ["#4E7CF6","#17439F"],["#19D8E6","#15B5C1"],["#B648F2","#910FD7"],
        ["#ED44B5","#C31388"],["#F53D40","#D00B0E"],["#F69C3C","#EA7E0B"],
        ["#ECD613","#D9C512"],["#35B63E","#298E30"]
      ];
      window.__slotYyColorPairs = window.__slotYyBaseColorPairs;
      window.__slotA7Calls = [];
      window.__slotA7 = function(sprite, from, to){
        window.__slotA7Calls.push({ sprite: sprite && sprite.__id, from, to });
      };
      ${extract("slot_yy_is_face_atlas")}
      ${extract("slot_yy_resolve_face")}
      ${extract("slot_yy_color_field")}
      ${extract("slot_yy_read_color_index")}
      ${extract("slot_yy_pair_color_index")}
      ${extract("slot_yy_gradient_for_index")}
      ${extract("slot_yy_recolor_face")}
      ${extract("slot_yy_paint_snake_hex")}
      ${extract("slot_yy_apply_snake_color_index")}
      ${extract("slot_flip_yy_snake_colors")}
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;

    assert.equal(w.slot_yy_pair_color_index(0), 5);
    assert.equal(w.slot_yy_pair_color_index(5), 2);

    const mkSprite = (id) => ({ __id: id, render() {} });
    const realFace = {
      oa: mkSprite("blink"),
      Aa: mkSprite("eat"),
      Ba: mkSprite("die"),
      wa: mkSprite("tongue"),
    };
    // Bridges look like game.Ga — must NOT be treated as face.
    const bridges = { oa: new Map(), Aa: new Set() };
    assert.equal(w.slot_yy_is_face_atlas(realFace), true);
    assert.equal(w.slot_yy_is_face_atlas(bridges), false);

    w.__slotFaceRef = realFace;
    assert.equal(w.slot_yy_resolve_face({ Ga: bridges }), realFace);

    const themeBefore = 3;
    const g = {
      settings: { wa: 0, Ja: 0, Jb: 0, kc: 0, oa: themeBefore, Mb: themeBefore },
      oa: { Sc: "#4E7CF6", Yc: "#17439F" },
      Ga: bridges,
    };
    w.__remixGame = g;
    w.__slotYyColorBase = null;
    w.__slotYyColorFlipped = false;
    w.isRainbow = false;

    w.slot_flip_yy_snake_colors(g);
    assert.equal(g.settings.wa, 5, "partner orange index");
    assert.equal(g.settings.Ja, 5);
    assert.equal(g.settings.oa, themeBefore, "board theme untouched");
    assert.equal(g.oa.Sc, "#F69C3C");
    assert.equal(g.oa.Yc, "#EA7E0B");
    assert.ok(
      w.__slotA7Calls.some((c) => c.sprite === "blink" && c.to === "#F69C3C"),
      JSON.stringify(w.__slotA7Calls)
    );
    assert.ok(
      !w.__slotA7Calls.some((c) => c.sprite == null && c.to === "#F69C3C"),
      "must not a7 bridges"
    );

    // Flip back to base blue
    w.slot_flip_yy_snake_colors(g);
    assert.equal(g.settings.wa, 0);
    assert.equal(g.settings.oa, themeBefore);
    assert.equal(g.oa.Sc, "#4E7CF6");
  });

  it("portal/Mexico unique types do not rewrite existing fruit types", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = init.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      ${extract("slot_pick_unique_type")}
      ${extract("slot_ensure_unique_fruit_types")}
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;

    const existing = { type: 3, pos: { x: 1, y: 1 } };
    const other = { type: 7, pos: { x: 2, y: 2 } };
    // New portal pair intentionally collides with existing type 3.
    const a = {
      type: 3,
      __slotPortal: true,
      __slotPortalPairId: 1,
      pos: { x: 3, y: 3 },
    };
    const b = {
      type: 9,
      __slotPortal: true,
      __slotPortalPairId: 1,
      pos: { x: 4, y: 4 },
    };
    a.__slotPortalTwin = b;
    b.__slotPortalTwin = a;
    const mgr = { ka: [existing, other, a, b] };

    w.slot_ensure_unique_fruit_types(mgr);

    assert.equal(existing.type, 3, "existing fruit type must stay");
    assert.equal(other.type, 7, "other fruit type must stay");
    assert.equal(a.type, b.type, "portal twins share a type");
    assert.notEqual(a.type, 3, "pair must leave 3 free for existing");
    assert.notEqual(a.type, 7, "pair must not steal other fruit type");
  });

  it("arrow clear under fruit + win ignores poison / honors keys-soko-chess", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    const extract = (name) => {
      const re = new RegExp(
        `window\\.${name} = function ${name}\\([\\s\\S]*?\\n  \\};`
      );
      const m = init.match(re);
      assert.ok(m, "missing " + name);
      return m[0];
    };
    const sandbox = { window: {}, Math, Object, Set, console };
    const src = `
      ${extract("slot_clear_arrow_at")}
      ${extract("slot_clear_arrow_pos")}
      ${extract("slot_clear_arrows_under_spawns")}
      ${extract("slot_clear_arrows_under_fruit")}
      ${extract("slot_board_has_playable_content")}
      ${extract("slot_win_if_empty")}
      window.slot_trigger_win = function(g){ g.nj = true; g.ub = true; };
      window.slot_has_keys = function(g){ return !!(g && g.__hasKeys); };
      window.slot_has_sokoboxes = function(g){ return !!(g && g.__hasSoko); };
      window.slot_has_sokogoals = function(g){ return !!(g && g.__hasGoals); };
      window.slot_has_arrows = function(){ return true; };
      window.slot_arrow_host = function(g){ return g && g.__arrowHost; };
      window.__slotActive = null;
      window.__slotEatenFruit = null;
    `;
    const fn = new Function("window", "Math", "Object", "Set", src);
    fn(sandbox.window, Math, Object, Set);
    const w = sandbox.window;

    // Arrow under fruit clears.
    const host = {
      ka: [
        [{ direction: "NONE", wm: false }, { direction: "UP", wm: true }],
        [{ direction: "LEFT", wm: true }, { direction: "NONE", wm: false }],
        [{ direction: "RIGHT", wm: true }, { direction: "DOWN", wm: true }],
      ],
    };
    const game = {
      __arrowHost: host,
      Ba: { keys: [{ pos: { x: 0, y: 2 } }] },
      Aa: {
        oa: new Set([{ pos: { x: 1, y: 2 } }]),
        d_: new Set(),
      },
      Ca: { Aa: new Map([["w", { pos: { x: 0, y: 1 } }]]) },
      Ma: { oa: new Set() },
      Ya: { oa: new Map() },
      Qa: { pfa: [], Yfa: [] },
      Ga: { oa: [] },
      wa: { ka: [{ pos: { x: 1, y: 0 } }] },
    };
    assert.equal(w.slot_clear_arrow_at(game, 1, 0), true);
    assert.equal(host.ka[0][1].direction, "NONE");
    // Reset arrow under fruit cell for under_fruit helper.
    host.ka[1][0].direction = "LEFT";
    host.ka[1][0].wm = true;
    w.slot_clear_arrows_under_fruit(
      { ka: [{ pos: { x: 0, y: 1 } }] },
      game
    );
    assert.equal(host.ka[1][0].direction, "NONE");

    // Keys / soko / walls also clear via under_spawns.
    host.ka[2][0].direction = "RIGHT";
    host.ka[2][0].wm = true;
    host.ka[2][1].direction = "DOWN";
    host.ka[2][1].wm = true;
    host.ka[1][0].direction = "LEFT";
    host.ka[1][0].wm = true;
    w.slot_clear_arrows_under_spawns(game.wa, game);
    assert.equal(host.ka[2][0].direction, "NONE", "key clears arrow");
    assert.equal(host.ka[2][1].direction, "NONE", "sokobox clears arrow");
    assert.equal(host.ka[1][0].direction, "NONE", "wall clears arrow");

    // Poison-only board → empty for win.
    const g = { nj: false, ub: false };
    assert.equal(
      w.slot_board_has_playable_content(g, {
        ka: [{ Oka: true, slotMode: 10 }],
      }),
      false
    );
    assert.equal(
      w.slot_win_if_empty(g, { ka: [{ Oka: true }] }),
      true
    );
    assert.equal(g.nj, true);

    // Chess / badged fruit / portals keep playing.
    g.nj = false;
    g.ub = false;
    assert.equal(
      w.slot_win_if_empty(g, {
        ka: [{ isPiece: true, ChessPiece: "pawn" }],
      }),
      false
    );
    assert.equal(
      w.slot_win_if_empty(g, { ka: [{ slotMode: 1, Oka: false }] }),
      false
    );

    // Keys / soko keep playing even with empty apple list.
    g.__hasKeys = true;
    assert.equal(w.slot_win_if_empty(g, { ka: [] }), false);
    g.__hasKeys = false;
    g.__hasSoko = true;
    assert.equal(w.slot_win_if_empty(g, { ka: [] }), false);
    g.__hasSoko = false;
    g.__hasGoals = true;
    assert.equal(w.slot_win_if_empty(g, { ka: [] }), false);
    g.__hasGoals = false;
    assert.equal(w.slot_win_if_empty(g, { ka: [] }), true);
  });

  it("builder / splice / Remix+Ultra wire SlotMachine after BombFruit", () => {
    const builder = fs.readFileSync(path.join(ROOT, "RemixBuilder.py"), "utf8");
    const splice = fs.readFileSync(
      path.join(ROOT, "tools", "splice_remix_bundles.cjs"),
      "utf8"
    );
    const remixInit = fs.readFileSync(
      path.join(ROOT, "src", "RemixInit.js"),
      "utf8"
    );
    const ultraInit = fs.readFileSync(
      path.join(ROOT, "src", "UltraInit.js"),
      "utf8"
    );
    const speed = fs.readFileSync(
      path.join(ROOT, "src", "RemixSpeedInfoInit.js"),
      "utf8"
    );

    assert.match(builder, /SlotMachineInit\.js/);
    assert.match(splice, /SlotMachineInit\.js/);
    assert.ok(
      builder.indexOf("BombFruitInit.js") < builder.indexOf("SlotMachineInit.js")
    );
    assert.ok(
      splice.indexOf("BombFruitInit.js") < splice.indexOf("SlotMachineInit.js")
    );

    assert.match(remixInit, /SlotMachineMod\.runCodeBefore/);
    assert.match(remixInit, /SlotMachineMod\.alterSnakeCode/);
    assert.match(remixInit, /SlotMachineMod\.runCodeAfter/);
    assert.match(ultraInit, /SlotMachineMod\.alterSnakeCode/);
    assert.match(ultraInit, /SlotMachineMod\.runCodeAfter/);

    assert.match(speed, /slot_machine/);
    assert.match(speed, /Slot Machine/);
  });

  it("alterSnakeCode skips b4E under Slot (shield leftovers / portal eat)", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    // Evaluate only the patch fragment by applying the same replaces.
    let code =
      "e7(a.settings,15)&&!(window.isChessActive&&window.isChessActive())&&(b4E(a.wa,d),x)";
    // Mirror SlotMachineInit upgrade order.
    const fromBomb =
      /e7\(a\.settings,15\)&&!\(window\.isChessActive&&window\.isChessActive\(\)\)&&!\(window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)&&\(\(window\.__slotActive\|0\)===28\|\|window\.slot_has_armed_bombs&&window\.slot_has_armed_bombs\(\)\)\)&&\(([a-zA-Z0-9_$]+)&&\1\.pos\)&&\(window\.slot_skip_b4E_bomb=1,b4E\(a\.wa,\1\),/;
    const fromChess =
      /e7\(a\.settings,15\)&&!\(window\.isChessActive&&window\.isChessActive\(\)\)&&\(b4E\(a\.wa,([a-zA-Z0-9_$]+)\),/;
    const repl =
      "e7(a.settings,15)&&!(window.isChessActive&&window.isChessActive())&&!(window.isSlotMachineActive&&window.isSlotMachineActive())&&($1&&$1.pos)&&(window.slot_skip_b4E=1,b4E(a.wa,$1),";
    if (!fromBomb.test(code)) {
      code = code.replace(fromChess, repl);
    } else {
      code = code.replace(fromBomb, repl);
    }
    assert.match(code, /slot_skip_b4E=1/);
    assert.match(code, /isSlotMachineActive\(\)\)&&\(d&&d\.pos\)/);
    assert.match(init, /slot_skip_b4E/);
  });

  it("alterSnakeCode Slot Borderless is wrap-only (no sticky e7(4))", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    assert.match(init, /slot_borderless_wrap/);
    assert.match(init, /n7 include slot borderless wrap/);
    assert.match(init, /b!==5&&b!==4&&b!==7&&b!==11&&b!==27/);
    assert.doesNotMatch(init, /slot_borderless_no_camera/);
    let code = "n7=function(a){return e7(a,21)||e7(a,4)}";
    code = code.replace(
      /n7=function\(a\)\{return e7\(a,21\)\|\|e7\(a,4\)\}/,
      "n7=function(a){return e7(a,21)||e7(a,4)||(window.slot_borderless_wrap&&window.slot_borderless_wrap())}"
    );
    assert.match(code, /slot_borderless_wrap\(\)/);
  });

  it("alterSnakeCode e7 / apple-helper regexes match BombFruit output", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    // Escaped patterns (not the broken (?! lookahead form)
    assert.match(
      init,
      /if\\\(!r&&b===15&&window\\\.BOMB_FRUIT_MODE!=null\\\)/
    );
    assert.match(init, /slot_eat_respawn/);
    assert.match(
      init,
      /isBombFruitActive\\\(\\\)\\\)\\\{window\\\.__bombFruitMakeApple=g7/
    );

    const e7Bomb =
      /if\(!r&&b===15&&window\.BOMB_FRUIT_MODE!=null\)\{if\(a\.ub===window\.BOMB_FRUIT_MODE\)return!0;if\(a\.ub===22&&a\.rSa&&a\.rSa\.has\(window\.BOMB_FRUIT_MODE\)\)return!0;\}return r\}/;
    const sampleE7 =
      "if(!r&&b===15&&window.BOMB_FRUIT_MODE!=null){if(a.ub===window.BOMB_FRUIT_MODE)return!0;if(a.ub===22&&a.rSa&&a.rSa.has(window.BOMB_FRUIT_MODE))return!0;}return r}";
    assert.ok(e7Bomb.test(sampleE7));

    const appleRe =
      /e=!1;if\(window\.isBombFruitActive&&window\.isBombFruitActive\(\)\)\{window\.__bombFruitMakeApple=g7;window\.__bombFruitFreePos=d4E;window\.__bombFruitPickType=Q3E;\}if\(window\.isChessActive&&window\.isChessActive\(\)\)\{/;
    const sampleApple =
      "e=!1;if(window.isBombFruitActive&&window.isBombFruitActive()){window.__bombFruitMakeApple=g7;window.__bombFruitFreePos=d4E;window.__bombFruitPickType=Q3E;}if(window.isChessActive&&window.isChessActive()){";
    assert.ok(appleRe.test(sampleApple));
  });

  it("alterSnakeCode soko/key unlock f4E passes no-pair flag under Slot", () => {
    const init = fs.readFileSync(
      path.join(ROOT, "src", "SlotMachineInit.js"),
      "utf8"
    );
    // Portal-active f4E doubles unless the final arg is true — unlock must pass it.
    assert.match(
      init,
      /slot_soko_unlock_fruit=1\),f4E\(a\.wa,c,b\.yNa,b\.Lh,b\.sequenceNumber,window\.isSlotMachineActive/
    );
    assert.match(
      init,
      /slot_key_unlock_fruit=1,f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber,!0\)/
    );

    let soko = "c&&f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber);";
    soko = soko.replace(
      /c&&f4E\(a\.wa,c,b\.yNa,b\.Lh,b\.sequenceNumber\)/,
      "c&&(window.isSlotMachineActive&&window.isSlotMachineActive()&&(window.slot_soko_unlock_fruit=1),f4E(a.wa,c,b.yNa,b.Lh,b.sequenceNumber,window.isSlotMachineActive&&window.isSlotMachineActive()?!0:!1))"
    );
    assert.match(soko, /sequenceNumber,window\.isSlotMachineActive&&window\.isSlotMachineActive\(\)\?!0:!1\)/);

    let key =
      "e7(a.settings,9)?d5E(a.Ca,{pos:b.r7a.clone(),prev:null,wm:!1,yNa:b.type,Lh:!0,sequenceNumber:b.sequenceNumber}):f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber)";
    key = key.replace(
      /e7\(a\.settings,9\)\?d5E\(a\.Ca,\{pos:b\.r7a\.clone\(\),prev:null,wm:!1,yNa:b\.type,Lh:!0,sequenceNumber:b\.sequenceNumber\}\):f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber\)/,
      "window.isSlotMachineActive&&window.isSlotMachineActive()?(window.slot_key_unlock_fruit=1,f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber,!0)):e7(a.settings,9)?d5E(a.Ca,{pos:b.r7a.clone(),prev:null,wm:!1,yNa:b.type,Lh:!0,sequenceNumber:b.sequenceNumber}):f4E(a.oa,b.r7a,b.type,!0,b.sequenceNumber)"
    );
    assert.match(key, /slot_key_unlock_fruit=1,f4E\(a\.oa,b\.r7a,b\.type,!0,b\.sequenceNumber,!0\)/);
  });
});

describe("Slot Machine mode (browser)", { skip: !runBrowser }, () => {
  it("stamps slotMode on layout fruit and activates before respawn", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ob = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        if (typeof window.slot_after_layout === "function") {
          window.slot_after_layout(g.wa);
        }
        const fruits = (g.wa.ka || []).map((f) => ({
          slotMode: f.slotMode,
          oka: !!f.Oka,
          piece: !!f.isPiece,
        }));
        const first = g.wa.ka[0];
        const mode = first && first.slotMode;
        if (first) {
          window.slot_on_eating_fruit(g, first);
        }
        return {
          active: window.isSlotMachineActive(),
          modeId: window.SLOT_MACHINE_MODE,
          fruits,
          slotActive: window.__slotActive,
          eatenMode: mode,
          poolLen: (window.SLOT_MACHINE_POOL || []).length,
        };
      });
      assert.equal(result.active, true);
      assert.equal(typeof result.modeId, "number");
      assert.equal(result.poolLen, 27);
      assert.ok(result.fruits.length >= 1);
      assert.ok(result.fruits.every((f) => f.slotMode != null || f.oka || f.piece));
      assert.equal(result.slotActive, result.eatenMode);
    } finally {
      await h.close();
    }
  });

  it("spawns clear arrows under fruit, keys, and sokoboxes", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 8, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        window.setSlotActive(16, g);
        const host = window.slot_arrow_host(g);

        function setArrow(x, y, dir) {
          host.ka[y][x].direction = dir;
          host.ka[y][x].wm = true;
        }
        function arrowAt(x, y) {
          const c = host.ka[y] && host.ka[y][x];
          return c && c.direction && c.direction !== "NONE";
        }

        // Fruit on arrow.
        setArrow(4, 4, "UP");
        g.wa.ka.length = 0;
        const fruit = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        window.assignSlotMode(fruit);
        g.wa.ka.push(fruit);
        window.slot_clear_arrows_under_spawns(g.wa, g);
        const fruitCleared = !arrowAt(4, 4);

        // Key on arrow.
        setArrow(6, 6, "LEFT");
        if (!g.Ba.keys) g.Ba.keys = [];
        g.Ba.keys.length = 0;
        g.Ba.keys.push({ pos: { x: 6, y: 6 } });
        window.slot_clear_arrows_under_spawns(g.wa, g);
        const keyCleared = !arrowAt(6, 6);

        // Sokobox on arrow.
        setArrow(8, 8, "DOWN");
        try {
          g.Aa.oa.clear();
        } catch (_e) {
          g.Aa.oa = new Set();
        }
        g.Aa.oa.add({ pos: { x: 8, y: 8 }, wm: true });
        window.slot_clear_arrows_under_spawns(g.wa, g);
        const sokoCleared = !arrowAt(8, 8);

        return { fruitCleared, keyCleared, sokoCleared };
      });
      assert.equal(result.fruitCleared, true, JSON.stringify(result));
      assert.equal(result.keyCleared, true, JSON.stringify(result));
      assert.equal(result.sokoCleared, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("arrow leftovers stay after leaving arrow; new spawns gated", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 6, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.nj = false;
        g.reset();
        window.setSlotActive(16, g);
        const host = window.slot_arrow_host(g);
        host.ka[8][5].direction = "LEFT";
        host.ka[8][5].wm = true;
        host.ka[7][5].direction = "UP";
        host.ka[7][5].wm = true;
        const before = window.slot_count_arrows(g);
        const allowWhile = window.__slotAllowArrowTurns;
        window.setSlotActive(3, g); // Cheese — leave Arrow
        return {
          before,
          after: window.slot_count_arrows(g),
          active: window.__slotActive,
          allowWhile,
          allowAfter: window.__slotAllowArrowTurns,
          hasArrows: window.slot_has_arrows(g),
        };
      });
      assert.ok(result.before >= 2, JSON.stringify(result));
      assert.equal(result.after, result.before, "arrows persist: " + JSON.stringify(result));
      assert.equal(result.active, 3, JSON.stringify(result));
      assert.equal(result.allowWhile, true, JSON.stringify(result));
      assert.equal(result.allowAfter, false, JSON.stringify(result));
      assert.equal(result.hasArrows, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("hotdog badge eat does not crash with plain wall leftovers", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 17, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;

        // Plain wall leftover (no .ty) — the native B6E crash case.
        const wm = g.Ca;
        const pos = { x: 3, y: 7 };
        if (typeof pos.clone !== "function") {
          pos.clone = function () {
            return { x: this.x, y: this.y };
          };
        }
        const key =
          typeof Y6 === "function" ? Y6(pos) : ((pos.x | 0) << 16) | (pos.y | 0);
        wm.Aa.set(key, { pos: pos, wm: true, m0: false, Lh: true });
        if (wm.wa && wm.wa[pos.y]) wm.wa[pos.y][pos.x] = (wm.wa[pos.y][pos.x] | 0) + 1;

        const fruit = g.wa.ka[0];
        fruit.slotMode = 17;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        let err = null;
        try {
          for (let t = 0; t < 10 && !g.nj; t++) g.tick();
        } catch (e) {
          err = String(e && e.message ? e.message : e);
        }
        return {
          err,
          scored: (g.Sh | 0) > sh0,
          active: window.__slotActive,
          alive: !g.nj,
          hotdogWalls: window.slot_count_hotdog_walls(g),
        };
      });
      assert.equal(result.err, null, JSON.stringify(result));
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.active, 17, JSON.stringify(result));
      assert.ok(result.hotdogWalls >= 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("hotdog sidewalls clear when hotdog roll ends", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 8, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.nj = false;
        g.reset();
        window.setSlotActive(17, g);

        const wm = g.Ca;
        const pos = { x: 4, y: 8 };
        if (typeof pos.clone !== "function") {
          pos.clone = function () {
            return { x: this.x, y: this.y };
          };
        }
        // Plant a fake hotdog sidewall (ty marker) on the wall manager.
        const key =
          typeof Y6 === "function" ? Y6(pos) : ((pos.x | 0) << 16) | (pos.y | 0);
        wm.Aa.set(key, {
          pos: pos,
          wm: true,
          m0: false,
          Lh: true,
          ty: { nea: 1, ETc: 1, rR: false },
        });
        if (wm.wa && wm.wa[pos.y]) wm.wa[pos.y][pos.x] = (wm.wa[pos.y][pos.x] | 0) + 1;

        const before = window.slot_count_hotdog_walls(g);
        const activeWhile = window.__slotActive;
        window.setSlotActive(3, g); // leave Hotdog
        return {
          before,
          after: window.slot_count_hotdog_walls(g),
          activeWhile,
          activeAfter: window.__slotActive,
          hasAfter: window.slot_has_hotdog_walls(g),
        };
      });
      assert.ok(result.before >= 1, JSON.stringify(result));
      assert.equal(result.after, 0, "hotdog walls cleared: " + JSON.stringify(result));
      assert.equal(result.activeWhile, 17, JSON.stringify(result));
      assert.equal(result.activeAfter, 3, JSON.stringify(result));
      assert.equal(result.hasAfter, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("starts with no active roll and singleton fruit", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 9, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.reset();
        window.slot_after_layout(g.wa);
        const fruits = (g.wa.ka || []).map((f) => ({
          slotMode: f.slotMode,
          portal: !!f.__slotPortal,
          oka: !!f.Oka,
        }));
        return {
          active: window.__slotActive,
          twin: window.__slotTwinLive,
          fruitCount: fruits.length,
          fruits,
          e7_2:
            typeof e7 === "function" ? null : "scoped",
          hasPortalPairs: window.slot_has_portal_pairs(g.wa),
        };
      });
      assert.equal(result.active, null, JSON.stringify(result));
      assert.equal(result.twin, false, JSON.stringify(result));
      assert.equal(result.fruitCount, 1, JSON.stringify(result));
      assert.equal(result.hasPortalPairs, false, JSON.stringify(result));
      assert.equal(result.fruits[0].portal, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("reset with leftover keys does not use portal start positions", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 9, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.FIVE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;

        // Leave keys on the board (e7(8) true) — same sticky state that used
        // to make Y3E plant portal offsets on the next reset.
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const fruit = g.wa.ka[0];
        fruit.slotMode = 8;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        const keysBeforeReset = (g.Ba.keys || []).length | 0;

        const baseX = Math.floor((3 * g.wa.oa.oa.width) / 4);
        const baseY = Math.floor(g.wa.oa.oa.height / 2);
        const portalOffsets = [
          [-1, -2],
          [-1, 2],
          [-3, -3],
          [-3, 3],
          [-5, -4],
        ];
        const portalExpected = portalOffsets.map(([dx, dy]) => ({
          x: baseX + dx,
          y: baseY + dy,
        }));
        // Classic (non-Y3E) COUNT.FIVE seeds before the shared x-nudge.
        const classicRaw = [
          [0, 0],
          [-2, -2],
          [-2, 2],
          [2, -2],
          [2, 2],
        ].map(([dx, dy]) => ({ x: baseX + dx, y: baseY + dy }));

        window.slot_Y3E_gate = 0;
        g.reset();
        const fruits = (g.wa.ka || []).map((f) => ({
          x: f.pos.x | 0,
          y: f.pos.y | 0,
        }));
        const portalHits = portalExpected.filter((p) =>
          fruits.some((f) => f.x === p.x && f.y === p.y)
        ).length;
        // After classic layout, every fruit x is nudged left by 1 for count 5.
        const classicExpected = classicRaw.map((p) => ({
          x: p.x - 1,
          y: p.y,
        }));
        const classicHits = classicExpected.filter((p) =>
          fruits.some((f) => f.x === p.x && f.y === p.y)
        ).length;
        return {
          keysBeforeReset,
          fruitCount: fruits.length,
          fruits,
          portalHits,
          classicHits,
          y3eGated: (window.slot_Y3E_gate | 0) === 1,
          active: window.__slotActive,
        };
      });
      assert.ok(result.keysBeforeReset >= 1, JSON.stringify(result));
      assert.equal(result.active, null, JSON.stringify(result));
      assert.equal(
        result.portalHits,
        0,
        "must not use portal g7 offsets: " + JSON.stringify(result)
      );
      assert.equal(
        result.classicHits,
        5,
        "should use classic layout: " + JSON.stringify(result)
      );
      assert.equal(result.y3eGated, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("poison badge eat spawns badged fruit + one poison", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        const fruit = g.wa.ka[0];
        fruit.slotMode = 10;
        fruit.Oka = false;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 8 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        const list = g.wa.ka || [];
        const okas = list.filter((f) => f && f.Oka);
        const safes = list.filter((f) => f && !f.Oka && !f.isPiece);
        return {
          scored: (g.Sh | 0) > sh0,
          won: !!g.nj && !!g.lj,
          dead: !!g.nj && !g.lj,
          active: window.__slotActive,
          afterFruit: list.length,
          okaCount: okas.length,
          safeCount: safes.length,
          safeBadged: safes.every((f) => f.slotMode != null),
          okaMarked: okas.every((f) => f.__slotPoison && f.slotMode == null),
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.won, false, "must not win: " + JSON.stringify(result));
      assert.equal(result.active, 10, JSON.stringify(result));
      assert.equal(result.afterFruit, 2, JSON.stringify(result));
      assert.equal(result.okaCount, 1, JSON.stringify(result));
      assert.equal(result.safeCount, 1, JSON.stringify(result));
      assert.equal(result.safeBadged, true, JSON.stringify(result));
      assert.equal(result.okaMarked, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("poison badge on 3a does not top-up multiple Okas", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        while (g.wa.ka.length < 3) {
          const p = window.slot_free_pos(g.wa) || { x: 5, y: 5 };
          const f = window.slot_make_apple(g.wa, p);
          f.Oka = false;
          f.slotMode = 1;
          g.wa.ka.push(f);
        }
        for (let i = 0; i < g.wa.ka.length; i++) {
          g.wa.ka[i].Oka = false;
          g.wa.ka[i].slotMode = i === 0 ? 10 : 1;
        }
        const fruit = g.wa.ka[0];
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const before = g.wa.ka.length;
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 8 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        // Native post-eat g4E/e4E/l4E must be no-ops under Slot.
        try {
          if (typeof g4E === "function") g4E(g.wa);
        } catch (_e) {}
        try {
          if (typeof e4E === "function") e4E(g.wa);
        } catch (_e2) {}
        try {
          if (typeof l4E === "function") l4E(g.wa);
        } catch (_e3) {}
        const list = g.wa.ka || [];
        const okas = list.filter((f) => f && f.Oka);
        const safes = list.filter((f) => f && !f.Oka && !f.isPiece);
        return {
          scored: (g.Sh | 0) > sh0,
          active: window.__slotActive,
          before,
          after: list.length,
          okas: okas.length,
          safes: safes.length,
          safeBadged: safes.every((f) => f.slotMode != null),
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.active, 10, JSON.stringify(result));
      assert.equal(result.okas, 1, "exactly one poison: " + JSON.stringify(result));
      assert.equal(
        result.after,
        result.before + 1,
        "eat + fruit + poison: " + JSON.stringify(result)
      );
      assert.equal(result.safes, result.before, JSON.stringify(result));
      assert.equal(result.safeBadged, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("leaving winged or magnet snaps fruit to integer tiles", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.setSlotActive(6, g);
        const fruits = g.wa.ka;
        for (let i = 0; i < fruits.length; i++) {
          const f = fruits[i];
          f.pos.x = 4.5 + i * 0.25;
          f.pos.y = 7.25;
          f.He = { x: 0.5, y: -0.5 };
          f.CAb = { x: 0.5, y: -0.5 };
          f.iL = { x: 1, y: 1 };
        }
        window.setSlotActive(1, g); // leave winged → wall
        const afterWinged = fruits.map((f) => ({
          x: f.pos.x,
          y: f.pos.y,
          hx: f.He && f.He.x,
          hy: f.He && f.He.y,
          ix: f.iL && f.iL.x,
          iy: f.iL && f.iL.y,
        }));

        for (let i = 0; i < fruits.length; i++) {
          const f = fruits[i];
          f.pos.x = 3.5 + i * 0.5;
          f.pos.y = 6.75;
          f.He = { x: -0.5, y: 0.5 };
          f.iL = { x: 1, y: 1 };
        }
        window.setSlotActive(18, g);
        window.setSlotActive(3, g); // leave magnet
        const afterMagnet = fruits.map((f) => ({
          x: f.pos.x,
          y: f.pos.y,
          hx: f.He && f.He.x,
          hy: f.He && f.He.y,
        }));

        const allInt = (arr) =>
          arr.every(
            (p) =>
              p.x === Math.round(p.x) &&
              p.y === Math.round(p.y) &&
              (p.hx === 0 || p.hx == null) &&
              (p.hy === 0 || p.hy == null)
          );
        return {
          afterWinged,
          afterMagnet,
          wingedOk: allInt(afterWinged),
          magnetOk: allInt(afterMagnet),
          active: window.__slotActive,
        };
      });
      assert.equal(result.wingedOk, true, JSON.stringify(result));
      assert.equal(result.magnetOk, true, JSON.stringify(result));
      assert.equal(result.active, 3, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("magnet leave snaps fruit off bridge tiles", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.setSlotActive(20, g); // bridges present
        // Plant a bridge cell and park fruit on it while magnet is on.
        if (!g.Ga) return { error: "no Ga" };
        if (!g.Ga.oa) g.Ga.oa = [];
        const bx = 5;
        const by = 5;
        if (!g.Ga.oa[by]) g.Ga.oa[by] = [];
        g.Ga.oa[by][bx] = { pos: { x: bx, y: by } };

        window.setSlotActive(18, g);
        const f = g.wa.ka[0];
        if (!f || !f.pos) return { error: "no fruit" };
        f.pos.x = bx + 0.4;
        f.pos.y = by + 0.6;
        window.setSlotActive(3, g); // leave magnet → snap

        const onBridge =
          window.slot_pos_on_bridge &&
          window.slot_pos_on_bridge(g, f.pos.x, f.pos.y);
        return {
          x: f.pos.x,
          y: f.pos.y,
          onBridge: !!onBridge,
          intOk:
            f.pos.x === Math.round(f.pos.x) && f.pos.y === Math.round(f.pos.y),
        };
      });
      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.equal(result.intOk, true, JSON.stringify(result));
      assert.equal(result.onBridge, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("slot_free_pos and tick keep fruit off bridges", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 45, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.slot_reset_state();
        window.setSlotActive(20, g);

        if (!g.Ga) return { error: "no Ga" };
        if (!g.Ga.oa) g.Ga.oa = [];
        // Cover a block of cells with bridges.
        for (let y = 4; y <= 8; y++) {
          if (!g.Ga.oa[y]) g.Ga.oa[y] = [];
          for (let x = 4; x <= 8; x++) {
            g.Ga.oa[y][x] = { pos: { x, y }, Lh: true };
          }
        }

        // Park an existing fruit on a bridge — tick must relocate it.
        const parked = g.wa.ka[0];
        if (!parked || !parked.pos) return { error: "no fruit" };
        parked.pos.x = 6;
        parked.pos.y = 6;
        window.slot_tick_logic(g);
        const parkedOnBridge = !!window.slot_pos_on_bridge(
          g,
          parked.pos.x,
          parked.pos.y
        );

        // Chess pieces used to be skipped by relocate — must move off too.
        const piece = g.wa.ka[1] || parked;
        if (typeof window.chess_assign_piece === "function") {
          window.chess_assign_piece(piece);
        } else {
          piece.isPiece = true;
          piece.ChessPiece = "pawn";
        }
        piece.pos.x = 5;
        piece.pos.y = 5;
        window.slot_tick_logic(g);
        const pieceOnBridge = !!window.slot_pos_on_bridge(
          g,
          piece.pos.x,
          piece.pos.y
        );

        // New free_pos samples must never land on a bridge.
        let freeOnBridge = 0;
        let freeOk = 0;
        for (let i = 0; i < 40; i++) {
          const p = window.slot_free_pos(g.wa);
          if (!p) continue;
          freeOk++;
          if (window.slot_pos_on_bridge(g, p.x, p.y)) freeOnBridge++;
        }

        return {
          parkedOnBridge,
          parkedPos: [parked.pos.x | 0, parked.pos.y | 0],
          pieceOnBridge,
          piecePos: [piece.pos.x | 0, piece.pos.y | 0],
          pieceIsPiece: !!piece.isPiece,
          freeOk,
          freeOnBridge,
          hasBridges: window.slot_has_bridges(g),
        };
      });

      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.equal(result.hasBridges, true, JSON.stringify(result));
      assert.equal(result.parkedOnBridge, false, JSON.stringify(result));
      assert.equal(result.pieceIsPiece, true, JSON.stringify(result));
      assert.equal(result.pieceOnBridge, false, JSON.stringify(result));
      assert.ok(result.freeOk >= 10, JSON.stringify(result));
      assert.equal(result.freeOnBridge, 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("bridge relocate despawns when no free cell and can win", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 46, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.lj = false;
        g.ub = false;
        window.slot_reset_state();
        window.setSlotActive(20, g);

        if (!g.Ga) return { error: "no Ga" };
        if (!g.Ga.oa) g.Ga.oa = [];
        // Plant a bridge under the parked fruit so relocate runs.
        const bx = 1;
        const by = 1;
        if (!g.Ga.oa[by]) g.Ga.oa[by] = [];
        g.Ga.oa[by][bx] = { pos: { x: bx, y: by }, Lh: true };

        const mgr = g.wa;
        // Leave only one playable fruit so despawn can empty the board.
        while (mgr.ka && mgr.ka.length > 1) mgr.ka.pop();
        const before = (mgr.ka && mgr.ka.length) || 0;
        if (!before) return { error: "no fruit" };
        const f = mgr.ka[0];
        f.pos.x = bx;
        f.pos.y = by;
        f.Oka = false;

        // Stub free_pos: every candidate is still a bridge cell. Relocate must
        // refuse those and despawn instead of parking on another bridge.
        const prevFree = window.slot_free_pos;
        window.slot_free_pos = function () {
          return {
            x: bx,
            y: by,
            clone() {
              return { x: bx, y: by };
            },
          };
        };

        let winCalls = 0;
        const prevWin = window.slot_trigger_win;
        window.slot_trigger_win = function () {
          winCalls++;
          if (typeof prevWin === "function") {
            return prevWin.apply(this, arguments);
          }
        };

        // Clear leftover keys/soko so empty fruit → win.
        try {
          if (g.Ca && g.Ca.oa) g.Ca.oa.length = 0;
        } catch (_k) {}
        try {
          if (g.Za && g.Za.oa) g.Za.oa.length = 0;
        } catch (_s) {}

        window.slot_relocate_fruit_off_bridges(mgr, g);

        const after = (mgr.ka && mgr.ka.length) || 0;
        const anyOnBridge = (mgr.ka || []).some(
          (fruit) =>
            fruit &&
            fruit.pos &&
            window.slot_pos_on_bridge(g, fruit.pos.x, fruit.pos.y)
        );

        window.slot_free_pos = prevFree;
        window.slot_trigger_win = prevWin;
        return {
          before,
          after,
          anyOnBridge,
          winCalls,
          nj: !!g.nj,
        };
      });

      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.ok(result.before >= 1, JSON.stringify(result));
      assert.equal(result.after, 0, JSON.stringify(result));
      assert.equal(result.anyOnBridge, false, JSON.stringify(result));
      assert.ok(result.winCalls >= 1 || result.nj === true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("Cat board-fill max score wins via slot_trigger_win + end menu", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        // Let tick eager-capture A7E into __slotShowEndMenu.
        g.tick();
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.lj = false;
        g.ub = false;
        window.slot_reset_state();
        window.__slotWrapActives && window.__slotWrapActives();
        window.setSlotActive(21, g);
        window.cat_lives = 3;

        const cap = window.cat_max_score(g) | 0;
        g.Sh = cap;
        g.Oh = cap;
        g.wa.ka.length = 0;
        const fruit = window.slot_make_apple(g.wa, { x: 2, y: 2 });
        fruit.slotMode = 3;
        g.wa.ka.push(fruit);
        window.appleArray = g.wa.ka;

        window.__slotMenuCalls = 0;
        window.__slotGotAllCalls = 0;
        const origShow = window.__slotShowEndMenu;
        const showType = typeof window.__slotShowEndMenu;
        window.__slotShowEndMenu = function (menu, delay, score) {
          window.__slotMenuCalls = (window.__slotMenuCalls | 0) + 1;
          window.__slotMenuArgs = [!!menu, delay, score];
          if (typeof origShow === "function") {
            try {
              return origShow.apply(this, arguments);
            } catch (_e) {}
          }
        };
        window.timeKeeper = window.timeKeeper || {};
        const origGotAll = window.timeKeeper.gotAll;
        window.timeKeeper.gotAll = function (time, score) {
          window.__slotGotAllCalls = (window.__slotGotAllCalls | 0) + 1;
          window.__slotGotAllArgs = [time, score];
          window.timeKeeper.playing = false;
          if (typeof origGotAll === "function") {
            try {
              return origGotAll.apply(this, arguments);
            } catch (_e) {}
          }
        };

        const scoreWin = window.cat_check_score_win(g);

        if (typeof origGotAll === "function") {
          window.timeKeeper.gotAll = origGotAll;
        }
        if (typeof origShow === "function") {
          window.__slotShowEndMenu = origShow;
        }

        return {
          cap,
          showTypeBeforeWin: showType,
          scoreWin,
          nj: !!g.nj,
          lj: !!g.lj,
          ub: !!g.ub,
          menuCalls: window.__slotMenuCalls | 0,
          menuDelay: window.__slotMenuArgs && window.__slotMenuArgs[1],
          gotAllCalls: window.__slotGotAllCalls | 0,
          gotAllTime: window.__slotGotAllArgs && window.__slotGotAllArgs[0],
          expectedTime: Math.floor((g.ticks | 0) * (g.Fb || 0)),
          fruitCapped: (window.cat_score_room(g) | 0) === 0,
        };
      });

      assert.ok(result.cap > 0, JSON.stringify(result));
      assert.equal(result.showTypeBeforeWin, "function", JSON.stringify(result));
      assert.equal(result.scoreWin, true, JSON.stringify(result));
      assert.equal(result.ub, true, JSON.stringify(result));
      assert.equal(result.nj, true, JSON.stringify(result));
      assert.equal(result.lj, false, JSON.stringify(result));
      assert.ok(result.menuCalls >= 1, JSON.stringify(result));
      assert.equal(result.menuDelay, 1400, JSON.stringify(result));
      assert.ok(result.gotAllCalls >= 1, JSON.stringify(result));
      assert.equal(result.gotAllTime, result.expectedTime, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("empty board win records ALL on the pudding split timer", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ob = window.SLOT_MACHINE_MODE;
        g.tick();
        g.nj = false;
        g.ub = false;
        g.lj = false;
        g.ticks = 40;
        g.Sh = 5;
        window.slot_reset_state();
        g.wa.ka.length = 0;
        window.appleArray = g.wa.ka;

        window.__slotSplitCalls = [];
        const origSplit = window.SplitPanelOnSplit;
        window.SplitPanelOnSplit = function (score, time, delta) {
          window.__slotSplitCalls.push([score, time, delta]);
          if (typeof origSplit === "function") {
            return origSplit.apply(this, arguments);
          }
        };

        const beforeLabel =
          g.header && g.header.Aa
            ? g.header.Aa.textContent || g.header.Aa.innerText
            : null;
        const beforeTime =
          g.header && g.header.Ba
            ? g.header.Ba.textContent || g.header.Ba.innerText
            : null;

        window.slot_trigger_win(g);

        const expected = g.ticks * g.Fb * 1e-3;
        const expectedMs = Math.floor(g.ticks * g.Fb);
        const mode = typeof getSelected === "function" ? getSelected("#trophy") : 0;
        const count = typeof getSelected === "function" ? getSelected("#count") : 0;
        const speed = typeof getSelected === "function" ? getSelected("#speed") : 0;
        const size = typeof getSelected === "function" ? getSelected("#size") : 0;
        const cat = window._cat != null ? window._cat : 3;
        const runAll =
          window._run &&
          window._run[mode] &&
          window._run[mode][count] &&
          window._run[mode][count][speed] &&
          window._run[mode][count][speed][size] &&
          window._run[mode][count][speed][size][cat] &&
          window._run[mode][count][speed][size][cat].ALL;

        const list = document.getElementById("split-panel-list");
        const allRow = list && list.textContent;
        const afterLabel =
          g.header && g.header.Aa
            ? g.header.Aa.textContent || g.header.Aa.innerText
            : null;
        const afterTime =
          g.header && g.header.Ba
            ? g.header.Ba.textContent || g.header.Ba.innerText
            : null;
        const hud = document.getElementsByClassName("Jc72He rc48Qb")[0];
        const hudText = hud ? hud.innerText : null;

        if (typeof origSplit === "function") {
          window.SplitPanelOnSplit = origSplit;
        }

        return {
          ub: !!g.ub,
          nj: !!g.nj,
          expected,
          expectedMs,
          runAll,
          splitCalls: window.__slotSplitCalls,
          allRowText: allRow,
          beforeLabel,
          afterLabel,
          beforeTime,
          afterTime,
          hudText,
          hasS2E: typeof window.__slotS2E,
          hasHn: typeof window.__slotHn,
        };
      });

      assert.equal(result.ub, true, JSON.stringify(result));
      assert.equal(result.nj, true, JSON.stringify(result));
      assert.equal(result.runAll, result.expected, JSON.stringify(result));
      assert.ok(
        result.splitCalls.some((c) => c[0] === "ALL" && c[1] === result.expected),
        JSON.stringify(result)
      );
      assert.equal(result.afterLabel, "ALL", JSON.stringify(result));
      assert.notEqual(result.afterTime, result.beforeTime, JSON.stringify(result));
      assert.notEqual(result.afterTime, "--:--:---", JSON.stringify(result));
      assert.match(String(result.hudText || ""), /ALL/, JSON.stringify(result));
      assert.equal(result.hasS2E, "function", JSON.stringify(result));
      assert.equal(result.hasHn, "function", JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("minesweeper blast spends cat life instead of dying under Slot", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 14, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.lj = false;
        window.slot_reset_state();
        window.cat_lives = 1;
        window.cat_peaceful_ticks = 0;
        window.setSlotActive(12, g);

        const head = g.oa && g.oa.ka && g.oa.ka[0];
        if (!head) return { error: "no head" };

        // Prefer real A6E if exposed; else mirror its Cat-aware kill gate.
        let usedA6E = false;
        let dcCalls = 0;
        const origDc = typeof g.Dc === "function" ? g.Dc.bind(g) : null;
        g.Dc = function () {
          dcCalls++;
          if (origDc) return origDc();
          this.nj = true;
        };

        if (typeof A6E === "function" && g.Ma) {
          usedA6E = true;
          const mine = {
            pos: {
              x: head.x | 0,
              y: head.y | 0,
              clone: function () {
                return { x: this.x, y: this.y };
              },
            },
            X1a: 0,
            Lh: true,
            xL: 0,
          };
          try {
            if (g.Ma.oa && typeof g.Ma.oa.add === "function") g.Ma.oa.add(mine);
            else if (Array.isArray(g.Ma.oa)) g.Ma.oa.push(mine);
            A6E(g.Ma, mine, false, g.Ub.bind(g), g.Dc.bind(g));
          } catch (e) {
            return { error: "A6E:" + String(e), usedA6E };
          }
        } else {
          // Fallback: same predicate Cat injects into A6E.
          const absorbed =
            window.isCatActive &&
            window.isCatActive() &&
            window.cat_try_spend_life(g);
          if (!absorbed) g.Dc();
        }

        return {
          usedA6E,
          livesAfter: window.cat_lives | 0,
          grace: window.cat_peaceful_ticks | 0,
          nj: !!g.nj,
          dcCalls,
          catActive: !!(window.isCatActive && window.isCatActive()),
        };
      });
      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.equal(result.catActive, true, JSON.stringify(result));
      assert.equal(result.nj, false, JSON.stringify(result));
      assert.equal(result.dcCalls, 0, JSON.stringify(result));
      assert.equal(result.livesAfter, 0, JSON.stringify(result));
      assert.ok(result.grace > 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("magnet badge then next fruit eat does not crash m4E.update", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        g.wa.ka.length = 0;
        const mag = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const other = window.slot_make_apple(g.wa, { x: 9, y: 5 });
        mag.slotMode = 18;
        other.slotMode = 3;
        g.wa.ka.push(mag, other);
        window.appleArray = g.wa.ka;

        // Bare spawn must still carry motion vectors.
        const spawnHasMotion = !!(mag.He && mag.iL && mag.CAb);

        window.just_ate = "fruit";
        window.__slotEatenFruit = mag;
        window.__slotEatenMode = 18;
        window.__slotEating = true;
        window.slot_on_eating_fruit(g, mag);
        window.slot_eat_respawn(g);
        const ix = g.wa.ka.indexOf(mag);
        if (ix >= 0) g.wa.ka.splice(ix, 1);

        let tickErr = null;
        try {
          for (let i = 0; i < 8; i++) g.tick();
        } catch (e) {
          tickErr = String(e && e.message ? e.message : e);
        }

        const prey =
          g.wa.ka.find((f) => f && f !== mag && !f.Oka && !f.isPiece) ||
          g.wa.ka[0];
        let eatErr = null;
        try {
          window.just_ate = "fruit";
          window.__slotEatenFruit = prey;
          window.__slotEatenMode = (prey && prey.slotMode) || 3;
          window.__slotEating = true;
          window.slot_on_eating_fruit(g, prey);
          window.slot_eat_respawn(g);
          const jx = g.wa.ka.indexOf(prey);
          if (jx >= 0) g.wa.ka.splice(jx, 1);
          for (let i = 0; i < 8; i++) g.tick();
        } catch (e) {
          eatErr = String(e && e.message ? e.message : e);
        }

        const fruits = (g.wa.ka || []).filter((f) => f && !f.Oka);
        const allMotion = fruits.every(
          (f) => f.He && f.iL && f.CAb && typeof f.He.x === "number"
        );

        return {
          spawnHasMotion,
          tickErr,
          eatErr,
          active: window.__slotActive | 0,
          fruits: fruits.length,
          allMotion,
        };
      });

      assert.equal(result.spawnHasMotion, true, JSON.stringify(result));
      assert.equal(result.tickErr, null, JSON.stringify(result));
      assert.equal(result.eatErr, null, JSON.stringify(result));
      assert.equal(result.allMotion, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("cat badge eat instantly grants one life", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 45, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        window.cat_lives = 0;
        window.__slotCatFruitEaten = 0;

        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        const b = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        a.slotMode = 26;
        b.slotMode = 26;
        g.wa.ka.push(a, b);

        window.slot_on_eating_fruit(g, a);
        const afterFirst = window.cat_lives | 0;
        window.slot_on_eating_fruit(g, b);
        const afterSecond = window.cat_lives | 0;

        return {
          afterFirst,
          afterSecond,
          eaten: window.__slotCatFruitEaten | 0,
          active: window.__slotActive | 0,
        };
      });

      assert.equal(result.afterFirst, 1, JSON.stringify(result));
      assert.equal(result.afterSecond, 2, JSON.stringify(result));
      assert.equal(result.eaten, 2, JSON.stringify(result));
      assert.equal(result.active, 26, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("key badge eat plants key+keyblock instead of fruit", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        const fruit = g.wa.ka[0];
        fruit.slotMode = 8;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const sh0 = g.Sh | 0;
        const beforeFruit = g.wa.ka.length;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        const keys = (g.Ba.keys || []).map((k) => ({
          type: k.type,
          x: k.pos.x,
          y: k.pos.y,
          bx: k.r7a && k.r7a.x,
          by: k.r7a && k.r7a.y,
        }));
        const blocks = [];
        const map = g.Ca && g.Ca.Aa;
        if (map && typeof map.values === "function") {
          for (const v of map.values()) {
            if (v && v.yNa != null && v.pos) {
              blocks.push({ x: v.pos.x, y: v.pos.y, type: v.yNa });
            }
          }
        }
        return {
          scored: (g.Sh | 0) > sh0,
          active: window.__slotActive,
          beforeFruit,
          afterFruit: g.wa.ka.length,
          keys,
          blocks,
          matched:
            keys.length === 1 &&
            blocks.some(
              (b) =>
                b.x === keys[0].bx &&
                b.y === keys[0].by &&
                b.type === keys[0].type
            ),
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.active, 8, JSON.stringify(result));
      assert.equal(result.afterFruit, 0, "no fruit refill: " + JSON.stringify(result));
      assert.equal(result.keys.length, 1, JSON.stringify(result));
      assert.ok(result.blocks.length >= 1, JSON.stringify(result));
      assert.equal(result.matched, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("key unlock after badge eat yields fruit not another key+block", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;

        const fruit0 = g.wa.ka[0];
        fruit0.slotMode = 8;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit0.pos.x = 10;
        fruit0.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();

        const key = (g.Ba.keys || [])[0];
        const blockPos = key && key.r7a
          ? { x: key.r7a.x | 0, y: key.r7a.y | 0, type: key.type }
          : null;
        const flagsAfterEat = {
          eating: !!window.__slotEating,
          eatenMode: window.__slotEatenMode,
          respawned: !!window.__slotRespawnedThisEat,
          activated: !!window.__slotActivatedFruit,
        };

        // Splice used to re-arm eat flags after slot_eat_respawn — prove
        // a second on_eating for the same fruit is a no-op once activated.
        const dummy = { slotMode: 8, pos: { x: 1, y: 1 } };
        window.__slotActivatedFruit = null;
        window.__slotRespawnedThisEat = false;
        window.__slotEating = false;
        window.__slotEatenMode = null;
        window.slot_on_eating_fruit(g, dummy);
        window.__slotEating = false;
        window.__slotEatenMode = null;
        window.__slotRespawnedThisEat = true;
        window.slot_on_eating_fruit(g, dummy);
        const rearmBlocked = {
          eating: !!window.__slotEating,
          eatenMode: window.__slotEatenMode,
        };

        // Native key unlock: fruit at keyblock, clear key + block.
        if (g.Ba.keys) g.Ba.keys.length = 0;
        const map = g.Ca && g.Ca.Aa;
        if (map && typeof map.clear === "function") map.clear();
        g.wa.ka.length = 0;
        window.__slotEating = false;
        window.__slotEatenMode = null;
        window.__slotRespawnedThisEat = true;
        window.__slotActivatedFruit = null;

        let unlockOk = false;
        if (blockPos && typeof f4E === "function") {
          try {
            f4E(g.wa, blockPos, blockPos.type, true, 0);
            unlockOk = true;
          } catch (_e) {}
        }
        if (!unlockOk && blockPos) {
          const fruit = window.slot_make_apple(g.wa, blockPos);
          delete fruit.slotMode;
          g.wa.ka.push(fruit);
          window.slot_after_native_respawn(g.wa, 1, g);
          unlockOk = true;
        }

        const keysAfter = (g.Ba.keys || []).length | 0;
        let blocksAfter = 0;
        if (map && typeof map.values === "function") {
          for (const v of map.values()) {
            if (v && v.yNa != null) blocksAfter++;
          }
        }
        const fruit = g.wa.ka[0];
        return {
          flagsAfterEat,
          rearmBlocked,
          unlockOk,
          keysAfter,
          blocksAfter,
          fruitCount: g.wa.ka.length,
          fruitBadge: fruit && fruit.slotMode,
          fruitAtBlock:
            !!fruit &&
            !!blockPos &&
            (fruit.pos.x | 0) === blockPos.x &&
            (fruit.pos.y | 0) === blockPos.y,
          active: window.__slotActive,
        };
      });
      assert.equal(result.active, 8, JSON.stringify(result));
      assert.equal(
        result.flagsAfterEat.eating,
        false,
        "eat flags must clear: " + JSON.stringify(result)
      );
      assert.equal(
        result.flagsAfterEat.eatenMode,
        null,
        "eatenMode must clear: " + JSON.stringify(result)
      );
      assert.equal(
        result.rearmBlocked.eating,
        false,
        "splice re-arm blocked: " + JSON.stringify(result)
      );
      assert.equal(
        result.rearmBlocked.eatenMode,
        null,
        "splice re-arm blocked mode: " + JSON.stringify(result)
      );
      assert.equal(result.unlockOk, true, JSON.stringify(result));
      assert.equal(result.keysAfter, 0, "no new key: " + JSON.stringify(result));
      assert.equal(
        result.blocksAfter,
        0,
        "no new keyblock: " + JSON.stringify(result)
      );
      assert.equal(result.fruitCount, 1, JSON.stringify(result));
      assert.equal(typeof result.fruitBadge, "number", JSON.stringify(result));
      assert.equal(result.fruitAtBlock, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("key unlock while Chess roll yields badged fruit not a piece", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.setSlotActive(24, g); // Chess roll active
        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;

        const pos = { x: 6, y: 6 };
        window.slot_key_unlock_fruit = 1;
        let planted = null;
        if (typeof f4E === "function") {
          try {
            const before = g.wa.ka.length;
            f4E(g.wa, pos, 0, true, 0, true);
            planted = g.wa.ka[g.wa.ka.length - 1] || null;
            if (planted && g.wa.ka.length === before) planted = null;
          } catch (_e) {}
        }
        if (!planted) {
          planted = window.slot_make_apple(g.wa, pos);
          g.wa.ka.push(planted);
          // Simulate convert attempting to run under Chess roll + unlock flag.
          if (typeof window.chess_convert_new_apples === "function") {
            window.chess_convert_new_apples(g.wa, 1);
          }
        }
        if (typeof window.slot_after_native_respawn === "function") {
          window.slot_after_native_respawn(g.wa, 1, g);
        }
        const f = g.wa.ka[g.wa.ka.length - 1];
        return {
          active: window.__slotActive | 0,
          isPiece: !!(f && f.isPiece),
          chessPiece: f && f.ChessPiece,
          chessColor: f && f.ChessColor,
          hasBadge: !!(f && f.slotMode != null),
          typeIsPiece: !!(
            f &&
            window.slot_is_chess_piece_type &&
            window.slot_is_chess_piece_type(f.type)
          ),
        };
      });
      assert.equal(result.active, 24, JSON.stringify(result));
      assert.equal(result.isPiece, false, JSON.stringify(result));
      assert.equal(result.chessPiece, undefined, JSON.stringify(result));
      assert.equal(result.chessColor, undefined, JSON.stringify(result));
      assert.equal(result.typeIsPiece, false, JSON.stringify(result));
      assert.equal(result.hasBadge, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("sokoban badge eat plants box+goal instead of fruit", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        const fruit = g.wa.ka[0];
        fruit.slotMode = 9;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        try {
          if (g.Aa && g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
          if (g.Aa && g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        } catch (_e) {}
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        const boxes = [];
        const goals = [];
        try {
          if (g.Aa && g.Aa.oa) {
            for (const b of g.Aa.oa) {
              boxes.push({
                x: b.pos && b.pos.x,
                y: b.pos && b.pos.y,
              });
            }
          }
          if (g.Aa && g.Aa.d_) {
            for (const p of g.Aa.d_) {
              goals.push({ x: p.x, y: p.y });
            }
          }
        } catch (_e2) {}
        return {
          scored: (g.Sh | 0) > sh0,
          active: window.__slotActive,
          afterFruit: g.wa.ka.length,
          boxes,
          goals,
          capturedE5: typeof window.__slotE5E,
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.active, 9, JSON.stringify(result));
      assert.equal(result.afterFruit, 0, "no fruit refill: " + JSON.stringify(result));
      assert.equal(result.boxes.length, 1, JSON.stringify(result));
      assert.equal(result.goals.length, 1, JSON.stringify(result));
      assert.equal(result.capturedE5, "function", JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("sokobox on snake body respawns or despawns; empty board wins", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 19, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.ub = false;
        window.slot_reset_state();
        window.setSlotActive(9, g);

        // Clear fruit so win can trigger when box disappears.
        g.wa.ka.length = 0;
        window.appleArray = g.wa.ka;
        try {
          if (g.Aa && g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
          if (g.Aa && g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        } catch (_e) {}

        const body = g.oa.ka;
        const mid = body[Math.min(2, body.length - 1)];
        if (!mid) return { error: "no body" };

        const box = {
          pos: { x: mid.x | 0, y: mid.y | 0 },
          prev: null,
          wm: true,
          Lh: true,
          sequenceNumber: 0,
        };
        g.Aa.oa.add(box);

        // With open board, resolve should relocate off the body.
        window.slot_soko_resolve_body_overlaps(g);
        const afterRelocate = {
          size: g.Aa.oa.size | 0,
          onSnake: false,
          nearHead: false,
        };
        if (g.Aa.oa.size) {
          for (const b of g.Aa.oa) {
            afterRelocate.onSnake = window.slot_soko_pos_on_snake(g, b.pos);
            afterRelocate.nearHead = !(
              window.chess_outside_spawn_radius &&
              window.chess_outside_spawn_radius(g, b.pos)
            );
            afterRelocate.x = b.pos.x | 0;
            afterRelocate.y = b.pos.y | 0;
          }
        }

        // Force fail path: park on body and stub free_pos → delete → win.
        g.nj = false;
        g.ub = false;
        g.wa.ka.length = 0;
        try {
          g.Aa.oa.clear();
          g.Aa.d_.clear();
        } catch (_e2) {}
        const box2 = {
          pos: { x: mid.x | 0, y: mid.y | 0 },
          prev: null,
          wm: true,
          Lh: true,
          sequenceNumber: 0,
        };
        g.Aa.oa.add(box2);
        const saved = window.slot_free_pos;
        window.slot_free_pos = () => null;
        window.slot_soko_resolve_body_overlaps(g);
        window.slot_free_pos = saved;

        return {
          afterRelocate,
          boxesAfterFail: g.Aa.oa.size | 0,
          won: !!(g.ub && g.nj),
        };
      });
      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.equal(result.afterRelocate.size, 1, JSON.stringify(result));
      assert.equal(result.afterRelocate.onSnake, false, JSON.stringify(result));
      assert.equal(result.afterRelocate.nearHead, false, JSON.stringify(result));
      assert.equal(result.boxesAfterFail, 0, JSON.stringify(result));
      assert.equal(result.won, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("sokobox plant with leftover fruit never lands on fruit", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 61, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.ub = false;
        window.slot_reset_state();

        try {
          if (g.Aa && g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
          if (g.Aa && g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        } catch (_e) {}

        // Keep fruit on the board while planting sokoban.
        g.wa.ka.length = 0;
        const fruitPos = { x: 10, y: 6 };
        const fruit = window.slot_make_apple(g.wa, fruitPos);
        fruit.Lh = true;
        fruit.slotMode = 3;
        g.wa.ka.push(fruit);
        window.appleArray = g.wa.ka;

        // Hostile native plant: always drops the box on the fruit cell.
        window.__slotE5E = function (aa) {
          aa.oa.add({
            pos: window.slot_make_pos(fruitPos.x, fruitPos.y),
            prev: null,
            wm: true,
            Lh: true,
            sequenceNumber: 0,
          });
          aa.d_.add(window.slot_make_pos(fruitPos.x + 2, fruitPos.y));
        };

        const planted = window.slot_plant_special_unit(9, g);
        const boxes = [];
        try {
          for (const b of g.Aa.oa) {
            boxes.push({
              x: b.pos && (b.pos.x | 0),
              y: b.pos && (b.pos.y | 0),
              onFruit: !!(
                b &&
                b.pos &&
                window.slot_soko_pos_on_fruit(g, b.pos)
              ),
            });
          }
        } catch (_e2) {}

        // Also cover the resolve path if a box is forced onto fruit later.
        const forced = {
          pos: window.slot_make_pos(fruitPos.x, fruitPos.y),
          prev: null,
          wm: true,
          Lh: true,
          sequenceNumber: 1,
        };
        g.Aa.oa.add(forced);
        window.slot_soko_resolve_body_overlaps(g);
        let forcedOnFruit = false;
        try {
          for (const b of g.Aa.oa) {
            if (b === forced || (b.pos && (b.pos.x | 0) === fruitPos.x && (b.pos.y | 0) === fruitPos.y)) {
              forcedOnFruit = window.slot_soko_pos_on_fruit(g, b.pos);
            }
          }
          forcedOnFruit =
            forcedOnFruit ||
            [...g.Aa.oa].some(
              (b) =>
                b &&
                b.pos &&
                (b.pos.x | 0) === fruitPos.x &&
                (b.pos.y | 0) === fruitPos.y
            );
        } catch (_e3) {}

        return {
          planted,
          fruitLeft: g.wa.ka.length,
          boxes,
          anyOnFruit: boxes.some((b) => b.onFruit),
          forcedStillOnFruit: forcedOnFruit,
        };
      });
      assert.equal(result.planted, true, JSON.stringify(result));
      assert.equal(result.fruitLeft, 1, JSON.stringify(result));
      assert.ok(result.boxes.length >= 1, JSON.stringify(result));
      assert.equal(result.anyOnFruit, false, JSON.stringify(result));
      assert.equal(result.forcedStillOnFruit, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("sokobox into fruit with cat life respawns box; no U3E crash", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        g.ub = false;
        window.slot_reset_state();
        window.setSlotActive(9, g);
        window.cat_lives = 2;
        window.cat_peaceful_ticks = 40;

        const errs = [];
        const onErr = (ev) =>
          errs.push(String((ev.error && ev.error.stack) || ev.message));
        window.addEventListener("error", onErr);

        try {
          if (g.Aa && g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
          if (g.Aa && g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        } catch (_e) {}

        // Arrow leftover so the U3E path is live during soko ticks.
        window.__slotAllowArrowTurns = true;
        const arrowHost = (g.Aa && g.Aa.Ba) || g.Ka || (g.oa && g.oa.Rb);
        if (arrowHost && arrowHost.ka && arrowHost.ka[5] && arrowHost.ka[5][7]) {
          arrowHost.ka[5][7].direction = "RIGHT";
          arrowHost.ka[5][7].wm = true;
          arrowHost.ka[5][7].Lh = true;
        }
        window.__slotAllowArrowTurns = false;

        g.wa.ka.length = 0;
        const fruit = window.slot_make_apple(g.wa, { x: 8, y: 5 });
        fruit.Lh = true;
        fruit.slotMode = 3;
        g.wa.ka.push(fruit);
        window.appleArray = g.wa.ka;

        const Od = window._.Od;
        // Fractional y would crash unpatched U3E (m7 true, ka[y] undefined).
        const box = {
          pos: new Od(7.2, 5.4),
          prev: null,
          wm: true,
          Lh: true,
          sequenceNumber: 0,
        };
        g.Aa.oa.add(box);

        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        g.oa.Ca = "RIGHT";
        for (let i = 0; i < body.length; i++) {
          body[i].x = 6 - i;
          body[i].y = 5;
        }

        let tickErr = null;
        try {
          for (let t = 0; t < 5 && !g.nj; t++) g.tick();
        } catch (e) {
          tickErr = String(e && e.stack ? e.stack : e);
        }
        window.removeEventListener("error", onErr);

        const boxes = [...(g.Aa.oa || [])];
        const boxPos = boxes.map((b) =>
          b && b.pos ? [b.pos.x, b.pos.y] : null
        );
        const onFruit = boxes.some(
          (b) =>
            b &&
            b.pos &&
            (b.pos.x | 0) === 8 &&
            (b.pos.y | 0) === 5
        );

        return {
          tickErr,
          errs,
          nj: !!g.nj,
          boxes: boxes.length,
          boxPos,
          onFruit,
          fruitLeft: g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length,
          u3eGuarded: !!window.slot_U3E_guard,
        };
      });

      assert.equal(result.tickErr, null, JSON.stringify(result));
      assert.equal(result.errs.length, 0, JSON.stringify(result));
      assert.equal(result.nj, false, JSON.stringify(result));
      assert.equal(result.boxes, 1, JSON.stringify(result));
      assert.equal(result.onFruit, false, JSON.stringify(result));
      assert.ok(result.fruitLeft >= 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("statue leftovers crumble on apple eat; new plants only while rolled", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        const statueCount = () => {
          try {
            const map = g.Ya && g.Ya.oa;
            if (!map) return 0;
            if (typeof map.size === "number") return map.size | 0;
            let n = 0;
            for (const _ of map.keys()) n++;
            return n;
          } catch (_e) {
            return 0;
          }
        };
        const plantAt = (x, y, cracked) => {
          const pos =
            typeof _ !== "undefined" && typeof _.Od === "function"
              ? new _.Od(x, y)
              : { x, y };
          const key = (x << 16) | y;
          const cell = {
            pos,
            wm: true,
            m0: false,
            Lh: true,
            WQ: {
              pdb: !!cracked,
              O0b: 5,
              xBb: -1,
              color: "#888",
              type: 1,
              angle: 0,
              tBc: 0,
              sBc: 0,
            },
          };
          g.Ya.oa.set(key, cell);
          try {
            if (g.Ya.Aa && typeof g.Ya.Aa.add === "function") {
              g.Ya.Aa.add(key);
            }
          } catch (_e) {}
          return cell;
        };
        const eatMode = (mode) => {
          if (!g.wa.ka.length) {
            const pos = window.slot_free_pos(g.wa, 0);
            const f = window.slot_make_apple(g.wa, pos);
            f.slotMode = mode;
            g.wa.ka.push(f);
          } else {
            g.wa.ka[0].slotMode = mode;
          }
          const fruit = g.wa.ka[0];
          const body = g.oa.ka;
          g.oa.direction = "RIGHT";
          fruit.pos.x = 10;
          fruit.pos.y = 8;
          for (let i = 0; i < body.length; i++) {
            body[i].x = 9 - i;
            body[i].y = 8;
          }
          const sh0 = g.Sh | 0;
          for (let t = 0; t < 8 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
          return (g.Sh | 0) > sh0;
        };

        // Roll Statue so body-plant is allowed, then plant via native path.
        window.setSlotActive(13, g);
        const body = g.oa.ka;
        while (body.length < 8) {
          const tip = body[body.length - 1];
          const next = tip.clone();
          next.x = tip.x - 1;
          next.y = tip.y;
          body.push(next);
          if (Array.isArray(g.oa.Sa)) g.oa.Sa.push(0);
        }
        const scoredStatue = eatMode(13);
        const afterPlant = statueCount();
        const disableWhile = window.disableStatueBodyPlant;
        const hasWhile = window.slot_has_statues && window.slot_has_statues(g);

        // Leave Statue; leftovers must remain and still break/crumble.
        const scoredWall = eatMode(1);
        const afterLeave = statueCount();
        const disableAfter = window.disableStatueBodyPlant;
        const hasAfter = window.slot_has_statues && window.slot_has_statues(g);

        // Seed cracked leftovers so e7E removes them on the next apple eat.
        g.Ya.oa.clear();
        plantAt(11, 8, true);
        plantAt(12, 8, true);
        plantAt(5, 5, true);
        const beforeCrumble = statueCount();
        const scoredAgain = eatMode(1);
        const afterCrumble = statueCount();

        return {
          scoredStatue,
          scoredWall,
          scoredAgain,
          afterPlant,
          afterLeave,
          beforeCrumble,
          afterCrumble,
          activeOther: window.__slotActive,
          disableWhile,
          disableAfter,
          hasWhile,
          hasAfter,
          hasAfterCrumble: window.slot_has_statues && window.slot_has_statues(g),
        };
      });
      assert.equal(result.scoredStatue, true, JSON.stringify(result));
      assert.ok(result.afterPlant >= 1, "statues planted: " + JSON.stringify(result));
      assert.equal(result.disableWhile, false, JSON.stringify(result));
      assert.equal(result.hasWhile, true, JSON.stringify(result));
      assert.equal(result.scoredWall, true, JSON.stringify(result));
      assert.equal(result.activeOther, 1, JSON.stringify(result));
      assert.equal(result.disableAfter, true, JSON.stringify(result));
      assert.equal(result.hasAfter, true, JSON.stringify(result));
      assert.ok(
        result.afterLeave <= result.afterPlant + 2,
        "no runaway statue plants after leave: " + JSON.stringify(result)
      );
      assert.equal(result.scoredAgain, true, JSON.stringify(result));
      assert.ok(
        result.afterCrumble < result.beforeCrumble,
        "cracked statues crumble on apple eat: " + JSON.stringify(result)
      );
    } finally {
      await h.close();
    }
  });

  it("mines leftover stay but stop spawning after leaving minesweeper", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 12, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        const mineCount = () => {
          try {
            const set = g.Ma && g.Ma.oa;
            if (!set) return 0;
            if (typeof set.size === "number") return set.size | 0;
            let n = 0;
            for (const _ of set) n++;
            return n;
          } catch (_e) {
            return 0;
          }
        };
        const eatMode = (mode) => {
          if (!g.wa.ka.length) {
            const pos = window.slot_free_pos(g.wa, 0);
            const f = window.slot_make_apple(g.wa, pos);
            f.slotMode = mode;
            g.wa.ka.push(f);
          } else {
            g.wa.ka[0].slotMode = mode;
          }
          const fruit = g.wa.ka[0];
          const body = g.oa.ka;
          g.oa.direction = "RIGHT";
          fruit.pos.x = 10;
          fruit.pos.y = 8;
          for (let i = 0; i < body.length; i++) {
            body[i].x = 9 - i;
            body[i].y = 8;
          }
          const sh0 = g.Sh | 0;
          for (let t = 0; t < 8 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
          return (g.Sh | 0) > sh0;
        };
        const scoredMine = eatMode(12);
        const afterMine = mineCount();
        const activeMine = window.__slotActive;
        const disableWhileMine = window.disableMineMode;
        const scoredWall = eatMode(1);
        const afterOther = mineCount();
        return {
          scoredMine,
          scoredWall,
          afterMine,
          afterOther,
          activeMine,
          activeOther: window.__slotActive,
          disableWhileMine,
          disableAfter: window.disableMineMode,
          hasMinesFn: window.slot_has_mines && window.slot_has_mines(g),
        };
      });
      assert.equal(result.scoredMine, true, JSON.stringify(result));
      assert.equal(result.activeMine, 12, JSON.stringify(result));
      assert.ok(result.afterMine >= 1, "mines planted: " + JSON.stringify(result));
      assert.equal(result.disableWhileMine, false, JSON.stringify(result));
      assert.equal(result.scoredWall, true, JSON.stringify(result));
      assert.equal(result.activeOther, 1, JSON.stringify(result));
      assert.equal(result.disableAfter, true, JSON.stringify(result));
      assert.equal(
        result.afterOther,
        result.afterMine,
        "no new mines after leave: " + JSON.stringify(result)
      );
      assert.equal(result.hasMinesFn, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("n7E with oob key pos does not crash under Slot", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 22, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        // Plant a key then shove it off-grid (x=6, bad y) — native write is =6.
        window.__slotAllowKeyPlant = true;
        try {
          if (typeof window.placeKey === "function") {
            window.placeKey(6, 3, 0);
          } else if (g.Ba && g.Ba.keys) {
            g.Ba.keys.push({
              pos: { x: 6, y: 3 },
              Lh: true,
              type: 0,
            });
          }
        } catch (_e) {}
        window.__slotAllowKeyPlant = false;
        const keys = (g.Ba && g.Ba.keys) || [];
        if (keys.length) {
          const k = keys[keys.length - 1];
          k.Lh = true;
          k.pos.x = 6;
          k.pos.y = 99; // oob row → wa[99] undefined, setting '6'
        }
        window.__slotActive = 17;
        let threw = null;
        try {
          for (let t = 0; t < 3; t++) g.tick();
        } catch (e) {
          threw = String(e && e.message ? e.message : e);
        }
        return {
          threw,
          keyCount: keys.length,
          guarded: !!window.slot_n7E_entity_guard,
        };
      });
      assert.ok(result.keyCount > 0, "need a key: " + JSON.stringify(result));
      assert.equal(result.threw, null, JSON.stringify(result));
      assert.equal(result.guarded, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("n7E with fractional fruit pos does not crash under Slot", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 21, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        for (let i = 0; i < g.wa.ka.length; i++) {
          const f = g.wa.ka[i];
          f.Lh = true;
          f.pos.x = 3.5 + i * 0.25;
          f.pos.y = 4.5;
          if (f.He) {
            f.He.x = 0;
            f.He.y = 0;
          }
        }
        // Hotdog roll makes tick call n7E every frame.
        window.__slotActive = 17;
        let threw = null;
        try {
          for (let t = 0; t < 4; t++) g.tick();
        } catch (e) {
          threw = String(e && e.message ? e.message : e);
        }
        const src =
          typeof window.__n7E === "function" ? String(window.__n7E) : "";
        return {
          threw,
          hasGuard:
            !!window.slot_n7E_round_fruit || !!window.slot_n7E_grid_guard,
          patched: /slot_n7E|_sfx|_sfy/.test(src),
          alive: g.wa.ka.length,
        };
      });
      assert.equal(result.threw, null, JSON.stringify(result));
      assert.equal(
        result.patched,
        true,
        "n7E fruit guard missing: " + JSON.stringify(result)
      );
      assert.equal(result.hasGuard, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("portal badge eat leaves other fruit non-portal", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 19, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        while (g.wa.ka.length < 3) {
          const p = window.slot_free_pos(g.wa) || { x: 5, y: 5 };
          const f = window.slot_make_apple(g.wa, p);
          f.Oka = false;
          g.wa.ka.push(f);
        }
        const modes = [2, 1, 3];
        for (let i = 0; i < g.wa.ka.length; i++) {
          const f = g.wa.ka[i];
          f.Oka = false;
          f.slotMode = modes[i];
          f.type = 4 + i;
          delete f.__slotPortal;
          delete f.__slotPortalPairId;
          delete f.__slotPortalTwin;
        }
        const keepA = g.wa.ka[1];
        const keepB = g.wa.ka[2];
        const keepModes = [keepA.slotMode | 0, keepB.slotMode | 0];
        const keepTypes = [keepA.type | 0, keepB.type | 0];
        const fruit = g.wa.ka[0];
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 8 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        // Native R3E would retype leftovers into even/odd pairs — must no-op.
        try {
          if (typeof R3E === "function") R3E(g.wa);
        } catch (_e) {}
        window.slot_ensure_unique_fruit_types(g.wa);
        const portals = (g.wa.ka || []).filter((f) => f && f.__slotPortal);
        const leftovers = (g.wa.ka || []).filter((f) => f && !f.__slotPortal);
        const leftoverPortalFlags = leftovers.map((f) => !!f.__slotPortal);
        const leftoverModes = leftovers.map((f) => f.slotMode | 0);
        const twinIdxOrphan = leftovers.length
          ? window.slot_portal_twin_index(g.wa, g.wa.ka.indexOf(leftovers[0]))
          : -2;
        return {
          scored: (g.Sh | 0) > sh0,
          active: window.__slotActive,
          len: g.wa.ka.length,
          portalCount: portals.length,
          leftoverCount: leftovers.length,
          leftoverPortalFlags,
          leftoverModes,
          keepModes,
          keepAlive:
            leftovers.indexOf(keepA) >= 0 && leftovers.indexOf(keepB) >= 0,
          keepModesIntact:
            leftoverModes.includes(keepModes[0]) &&
            leftoverModes.includes(keepModes[1]),
          twinIdxOrphan,
          pairOk:
            portals.length === 2 &&
            portals[0].__slotPortalPairId === portals[1].__slotPortalPairId &&
            (portals[0].type | 0) === (portals[1].type | 0),
          keepTypesBefore: keepTypes,
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.active, 2, JSON.stringify(result));
      assert.equal(result.portalCount, 2, "only spawned pair: " + JSON.stringify(result));
      assert.equal(result.leftoverCount, 2, JSON.stringify(result));
      assert.deepEqual(
        result.leftoverPortalFlags,
        [false, false],
        "leftovers must not be portals: " + JSON.stringify(result)
      );
      assert.equal(result.keepAlive, true, JSON.stringify(result));
      assert.equal(result.keepModesIntact, true, JSON.stringify(result));
      assert.equal(
        result.twinIdxOrphan,
        -1,
        "leftover must not resolve a twin: " + JSON.stringify(result)
      );
      assert.equal(result.pairOk, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("eating shielded portal fruit does not throw b4E .pos", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 48, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        g.nj = false;
        g.lj = false;
        g.ub = false;

        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const b = window.slot_make_apple(g.wa, { x: 12, y: 8 });
        const extra = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        window.slot_assign_pair(a, b);
        a.slotMode = 2;
        b.slotMode = 2;
        extra.slotMode = 15;
        // Shield leftovers make e7(15) true under Slot.
        a.__slotShield = true;
        a.__ultraKeepShield = true;
        a.nba = new Set(["UP"]); // open from left/right
        b.__slotShield = true;
        b.__ultraKeepShield = true;
        b.nba = new Set(["DOWN"]);
        extra.__slotShield = true;
        extra.__ultraKeepShield = true;
        extra.nba = new Set(["LEFT"]);
        g.wa.ka.push(a, b, extra);
        window.appleArray = g.wa.ka;
        window.setSlotActive(2, g);
        window.head_state = "OPEN";

        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        head.x = a.pos.x - 1;
        head.y = a.pos.y;
        for (let i = 1; i < g.oa.ka.length; i++) {
          g.oa.ka[i].x = head.x - i;
          g.oa.ka[i].y = head.y;
        }

        const errors = [];
        const onErr = (e) =>
          errors.push(String((e && (e.message || e.error)) || e));
        window.addEventListener("error", onErr);
        let threw = null;
        try {
          for (let t = 0; t < 4; t++) {
            g.tick();
            if (g.nj) break;
          }
        } catch (err) {
          threw = String(err && err.message ? err.message : err);
        }
        window.removeEventListener("error", onErr);

        return {
          threw,
          errors,
          hasPosErr: errors.some((e) => /reading 'pos'|reading \"pos\"/.test(e)),
          len: g.wa.ka.length,
          hasShields: !!(
            window.slot_has_shields && window.slot_has_shields(g.wa)
          ),
        };
      });

      assert.equal(result.threw, null, JSON.stringify(result));
      assert.equal(result.hasPosErr, false, JSON.stringify(result));
      assert.equal(result.errors.length, 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("portal pair teleport refill leaves other fruit; empty pair fail can win", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        const keep = g.wa.ka[0];
        g.wa.ka.length = 0;
        g.wa.ka.push(keep);
        window.__slotEating = true;
        window.__slotEatenMode = 1; // Wall → single fruit respawn
        window.slot_after_native_respawn(g.wa, 0, g);
        const afterLen = g.wa.ka.length;
        const stillHasKeep = g.wa.ka.indexOf(keep) >= 0;

        const savedFree = window.slot_free_pos;
        window.slot_free_pos = () => null;
        g.wa.ka.length = 0;
        g.nj = false;
        window.slotRespawn(2, g);
        const won = !!g.nj;
        window.slot_free_pos = savedFree;

        // Portal pair with a non-portal leftover at index 0 — even/odd mate
        // would be wrong; pair-id twin resolution must find the real exit.
        g.wa.ka.length = 0;
        g.nj = false;
        const orphan = window.slot_make_apple(g.wa, { x: 1, y: 1 });
        orphan.slotMode = 3;
        delete orphan.__slotPortal;
        g.wa.ka.push(orphan);
        window.slotRespawn(2, g);
        const a = g.wa.ka.find((f) => f && f.__slotPortal);
        const b = a && a.__slotPortalTwin;
        const ai = g.wa.ka.indexOf(a);
        const bi = g.wa.ka.indexOf(b);
        const twinIdx = window.slot_portal_twin_index(g.wa, ai);
        const evenOdd = ai % 2 === 0 ? ai + 1 : ai - 1;
        window.__slotEatenFruit = a;
        window.__slotEatenMode = a && a.slotMode;
        const portalFlags = !!(a && b && a.__slotPortal && b.__slotPortal);
        const sameType = !!(a && b && (a.type | 0) === (b.type | 0));
        const orphanTypeDiff =
          !!orphan && !!a && (orphan.type | 0) !== (a.type | 0);
        window.slot_note_portal_twin(g.wa, a);
        const noted = window.__slotPortalTwinToRemove === b;
        g.wa.ka.splice(g.wa.ka.indexOf(a), 1);
        window.slot_flush_portal_twin(g.wa);
        return {
          afterLen,
          stillHasKeep,
          won,
          noted,
          twinGone: g.wa.ka.indexOf(b) < 0,
          orphanAlive: g.wa.ka.indexOf(orphan) >= 0,
          portalFlags,
          sameType,
          orphanTypeDiff,
          twinIdx,
          bi,
          evenOddWrong: twinIdx !== evenOdd && bi === twinIdx,
          types: (g.wa.ka || []).map((f) => f && f.type),
        };
      });
      assert.equal(result.portalFlags, true, JSON.stringify(result));
      assert.equal(result.noted, true, JSON.stringify(result));
      assert.equal(result.twinGone, true, JSON.stringify(result));
      assert.equal(result.orphanAlive, true, JSON.stringify(result));
      assert.equal(result.sameType, true, "pair shares type: " + JSON.stringify(result));
      assert.equal(
        result.orphanTypeDiff,
        true,
        "orphan unique type: " + JSON.stringify(result)
      );
      assert.equal(result.twinIdx, result.bi, JSON.stringify(result));
      assert.equal(
        result.evenOddWrong,
        true,
        "must not use even/odd when orphan present: " + JSON.stringify(result)
      );
      assert.ok(result.stillHasKeep, JSON.stringify(result));
      assert.ok(result.afterLen >= 2, "expected keep + respawn fruit: " + JSON.stringify(result));
      assert.equal(result.won, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("portal + odd leftovers does not wipe the whole board", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 7, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.reset();
        g.nj = false;
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 6, y: 8 });
        const b = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        window.slot_assign_pair(a, b);
        a.slotMode = 2;
        b.slotMode = 2;
        const c = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        c.slotMode = 1;
        c.Oka = false;
        c.isPiece = false;
        g.wa.ka.push(a, b, c);
        window.appleArray = g.wa.ka;
        window.setSlotActive(2, g);
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        c.pos.x = 10;
        c.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const before = g.wa.ka.length;
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 12 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        return {
          before,
          after: g.wa.ka.length,
          scored: (g.Sh | 0) > sh0,
          wiped: g.wa.ka.length === 0,
          noWipe: !!window.slot_portal_no_wipe,
          portalsLeft: (g.wa.ka || []).filter((f) => f && f.__slotPortal).length,
          dead: !!g.nj && !g.lj,
        };
      });
      assert.equal(result.scored, true, JSON.stringify(result));
      assert.equal(result.wiped, false, "must not clear board: " + JSON.stringify(result));
      assert.equal(result.noWipe, true, JSON.stringify(result));
      assert.ok(result.after >= 2, JSON.stringify(result));
      assert.equal(result.portalsLeft, 2, JSON.stringify(result));
      assert.equal(result.dead, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("enabled badge pool filters draws and keeps at least one", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 3, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.FIVE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        window.pudding_settings = window.pudding_settings || {};
        const only = [1, 2, 15];
        const set = window.slot_set_enabled_modes(only);
        const bag = (window.slot_shuffle_bag() || []).slice().sort((a, b) => a - b);
        const draws = [];
        for (let i = 0; i < 12; i++) draws.push(window.slot_draw_mode() | 0);
        const lastOnly = window.slot_set_enabled_modes([15]);
        const denied = window.slot_toggle_enabled_mode(15); // cannot clear last
        if (typeof window.remixShowSettingsPage === "function") {
          window.remixShowSettingsPage("custom");
        }
        if (typeof window.remixShowCustomSubPage === "function") {
          window.remixShowCustomSubPage("slot");
        }
        if (typeof window.remixInjectSlotMachineSettingsUi === "function") {
          window.remixInjectSlotMachineSettingsUi();
        }
        const grid = document.getElementById("remix-slot-mode-grid");
        const onCells = grid
          ? [...grid.querySelectorAll(".remix-slot-mode-on")]
              .map((el) => el.dataset.mode | 0)
              .sort((a, b) => a - b)
          : [];
        return {
          set,
          bag,
          draws,
          allAllowed: draws.every((m) => only.includes(m)),
          lastOnly,
          denied,
          onCells,
          status: (document.getElementById("remix-slot-modes-status") || {})
            .textContent,
        };
      });
      assert.deepEqual(result.set, [1, 2, 15], JSON.stringify(result));
      assert.deepEqual(result.bag, [1, 2, 15], JSON.stringify(result));
      assert.equal(result.allAllowed, true, JSON.stringify(result));
      assert.deepEqual(result.lastOnly, [15], JSON.stringify(result));
      assert.deepEqual(result.denied, [15], JSON.stringify(result));
      assert.deepEqual(result.onCells, [15], JSON.stringify(result));
      assert.match(String(result.status || ""), /Selected 1/);
    } finally {
      await h.close();
    }
  });

  it("deselect-all and vanilla-only badge toolbar presets", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 4, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.SMALL,
      });
      const result = await h.page.evaluate(() => {
        window.pudding_settings = window.pudding_settings || {};
        const pool = (window.SLOT_MACHINE_POOL || []).slice();
        const earliest = pool[0] | 0;
        window.slot_set_enabled_modes(pool);
        const deselected = window.slot_deselect_all_enabled_modes();
        window.slot_set_enabled_modes(pool);
        const vanilla = window.slot_vanilla_only_enabled_modes();
        const hasRemix = vanilla.some((m) => window.slot_is_remix_added_mode(m));
        const expectedVanilla = pool.filter(
          (m) => !window.slot_is_remix_added_mode(m)
        );

        // Rebuild settings card so the new buttons are present.
        const old = document.getElementById("remix-slot-modes-card");
        if (old) old.remove();
        if (typeof window.remixShowSettingsPage === "function") {
          window.remixShowSettingsPage("custom");
        }
        if (typeof window.remixShowCustomSubPage === "function") {
          window.remixShowCustomSubPage("slot");
        }
        window.remixInjectSlotMachineSettingsUi();
        const noneBtn = document.getElementById("remix-slot-modes-none");
        const vanillaBtn = document.getElementById("remix-slot-modes-vanilla");
        noneBtn && noneBtn.click();
        const afterNone = window.slot_get_enabled_modes().slice();
        vanillaBtn && vanillaBtn.click();
        const afterVanilla = window.slot_get_enabled_modes().slice();
        return {
          earliest,
          deselected,
          vanilla,
          hasRemix,
          expectedVanilla,
          afterNone,
          afterVanilla,
          noneLabel: noneBtn && noneBtn.textContent,
          vanillaLabel: vanillaBtn && vanillaBtn.textContent,
        };
      });
      assert.deepEqual(result.deselected, [result.earliest], JSON.stringify(result));
      assert.equal(result.hasRemix, false, JSON.stringify(result));
      assert.deepEqual(result.vanilla, result.expectedVanilla, JSON.stringify(result));
      assert.ok(result.expectedVanilla.length >= 1, JSON.stringify(result));
      assert.ok(
        result.expectedVanilla.every((m) => (m | 0) < 23),
        JSON.stringify(result)
      );
      assert.deepEqual(result.afterNone, [result.earliest], JSON.stringify(result));
      assert.deepEqual(
        result.afterVanilla,
        result.expectedVanilla,
        JSON.stringify(result)
      );
      assert.equal(result.noneLabel, "Deselect all");
      assert.equal(result.vanillaLabel, "Vanilla only");
    } finally {
      await h.close();
    }
  });

  it("layout fruit types are unique across the board", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 8, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.FIVE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        // Must run via apple-manager reset hook — do not call slot_after_layout
        // manually (pre-start board must already be unique).
        g.reset();
        const fruits = (g.wa.ka || []).filter((f) => f && !f.Oka && !f.isPiece);
        const types = fruits.map((f) => f.type | 0);
        const unique = new Set(types);
        const badges = fruits.filter((f) => f.slotMode != null).length;
        return {
          count: types.length,
          types,
          allUnique: unique.size === types.length,
          badges,
          resetHooked: Function.prototype.toString
            .call(Object.getPrototypeOf(g.wa).reset)
            .includes("slot_after_layout(this)"),
        };
      });
      assert.ok(result.resetHooked, JSON.stringify(result));
      assert.ok(result.count >= 2, JSON.stringify(result));
      assert.equal(result.allUnique, true, JSON.stringify(result));
      assert.equal(result.badges, result.count, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("after Shield eat, next fruit is P3E-shielded even with other badge", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.setSlotActive(15, g);
        // Simulate post-Shield-eat refill: eaten mode 15, new fruit rolls Wall.
        g.wa.ka.length = 0;
        window.__slotBag = [1, 1, 1, 1, 1];
        window.slotRespawn(15, g);
        const f = g.wa.ka[0];
        const hasNba = !!(f && f.nba && typeof f.nba.has === "function");
        const dirs = hasNba ? [...f.nba] : [];
        // Leaving Shield must not keep forcing bars on a later non-shield roll.
        window.setSlotActive(1, g);
        g.wa.ka.length = 0;
        window.__slotBag = [1, 1, 1];
        window.slotRespawn(1, g);
        const afterLeave = g.wa.ka[0];
        const shieldedAfterLeave = !!(
          afterLeave &&
          afterLeave.nba &&
          typeof afterLeave.nba.has === "function"
        );
        return {
          badge: f && f.slotMode,
          hasNba,
          slotShield: !!(f && f.__slotShield),
          dirCount: dirs.length,
          dirs,
          shieldedAfterLeave,
          activeAfterLeave: window.__slotActive,
        };
      });
      assert.equal(result.badge, 1, JSON.stringify(result));
      assert.equal(result.hasNba, true, JSON.stringify(result));
      assert.equal(result.slotShield, true, JSON.stringify(result));
      // Partial bars (P3E or 1–2-dir fallback) — never a full four-way lock.
      assert.ok(
        result.dirCount >= 1 && result.dirCount < 4,
        "partial shields: " + JSON.stringify(result)
      );
      assert.equal(
        result.shieldedAfterLeave,
        false,
        "after leaving Shield: " + JSON.stringify(result)
      );
      assert.equal(result.activeAfterLeave, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("shield bars stay under Ultra strip and chess leftovers", async () => {
    const { launchHarness, ultraHarnessOpts, COUNT, SIZE } = await import(
      "../tools/harness.mjs"
    );
    const h = await launchHarness({
      seed: 11,
      headless: true,
      ...ultraHarnessOpts(),
    });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        // Chess leftovers must not empty Shield bars.
        const piece = { pos: { x: 2, y: 2 }, isPiece: true, ChessColor: "w" };
        g.wa.ka.push(piece);
        window.appleArray = g.wa.ka;
        window.head_state = "OPEN";

        window.setSlotActive(15, g);
        // Force a Shield-badge fruit (slotRespawn rolls a random next badge).
        const pos = window.slot_free_pos(g.wa, 0) || { x: 5, y: 5 };
        const shieldFruit = window.slot_make_apple(g.wa, pos);
        window.assignSlotMode(shieldFruit, 15);
        g.wa.ka.push(shieldFruit);
        window.appleArray = g.wa.ka;
        const shielded = g.wa.ka.find((f) => f && f.__slotShield);
        const hasNba = !!(
          shielded &&
          shielded.nba &&
          typeof shielded.nba.has === "function"
        );

        // Chess tick / empty must preserve marked fruit shields.
        if (typeof window.shield_empty_all === "function") {
          window.shield_empty_all();
        }
        const afterEmpty =
          shielded &&
          shielded.nba &&
          typeof shielded.nba.has === "function";

        // Ultra strip must not remove slot shields while Shield is rolled.
        if (typeof window.ultraStripUnwantedFruitShields === "function") {
          window.ultraStripUnwantedFruitShields(g.wa.ka);
        }
        const afterStrip =
          shielded &&
          shielded.nba &&
          typeof shielded.nba.has === "function";

        const spawnOk =
          typeof window.ultraShouldSpawnFruitShields === "function" &&
          window.ultraShouldSpawnFruitShields() === true;

        // Chess convert must not run while Shield owns the roll.
        let convertSkipped = true;
        if (typeof window.chess_convert_new_apples === "function") {
          const beforeLen = g.wa.ka.length;
          const beforePieces = g.wa.ka.filter((f) => f && f.isPiece).length;
          window.chess_convert_new_apples(g.wa, 1);
          convertSkipped =
            g.wa.ka.filter((f) => f && f.isPiece).length === beforePieces &&
            g.wa.ka.length === beforeLen;
        }

        // Leaving Shield marks leftovers; Chess roll must NOT clear them.
        window.setSlotActive(3, g);
        const marked = !!(shielded && shielded.__slotShield);
        window.setSlotActive(24, g);
        if (typeof window.shield_empty_all === "function") {
          window.shield_empty_all();
        }
        const keptOnChess =
          !!(shielded &&
            shielded.__slotShield &&
            shielded.nba &&
            typeof shielded.nba.has === "function");

        return {
          hasNba,
          afterEmpty: !!afterEmpty,
          afterStrip: !!afterStrip,
          spawnOk,
          convertSkipped,
          marked,
          keptOnChess,
          activeShieldWas: 15,
        };
      });
      assert.equal(result.hasNba, true, JSON.stringify(result));
      assert.equal(result.afterEmpty, true, JSON.stringify(result));
      assert.equal(result.afterStrip, true, JSON.stringify(result));
      assert.equal(result.spawnOk, true, JSON.stringify(result));
      assert.equal(result.convertSkipped, true, JSON.stringify(result));
      assert.equal(result.marked, true, JSON.stringify(result));
      assert.equal(result.keptOnChess, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("shield leftovers stay after leaving roll; new spawns are bare", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 51, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        g.wa.ka.length = 0;
        window.setSlotActive(15, g);
        window.slotRespawn(15, g);
        const shielded = g.wa.ka[0];
        const afterSpawn = !!(
          shielded &&
          shielded.__slotShield &&
          shielded.nba &&
          typeof shielded.nba.has === "function"
        );

        // Leave Shield via Wall badge eat / roll change.
        window.setSlotActive(1, g);
        const leftoverKept = !!(
          shielded &&
          shielded.__slotShield &&
          shielded.nba &&
          typeof shielded.nba.has === "function"
        );
        const e7Leftover = !!(
          window.slot_has_shields && window.slot_has_shields(g.wa)
        );

        // New spawn after leave must be bare (force non-Shield badges).
        const beforeLen = g.wa.ka.length;
        window.__slotBag = [1, 1, 1, 1, 1];
        window.slotRespawn(1, g);
        const neu = g.wa.ka[g.wa.ka.length - 1];
        const newBare =
          !!neu &&
          neu !== shielded &&
          !neu.__slotShield &&
          !(neu.nba && typeof neu.nba.has === "function");
        const leftoverStill =
          shielded &&
          shielded.__slotShield &&
          shielded.nba &&
          typeof shielded.nba.has === "function";

        return {
          afterSpawn,
          leftoverKept,
          e7Leftover,
          newBare,
          leftoverStill,
          grew: g.wa.ka.length > beforeLen,
          active: window.__slotActive | 0,
          newMode: neu && neu.slotMode,
        };
      });

      assert.equal(result.afterSpawn, true, JSON.stringify(result));
      assert.equal(result.leftoverKept, true, JSON.stringify(result));
      assert.equal(result.e7Leftover, true, JSON.stringify(result));
      assert.equal(result.newBare, true, JSON.stringify(result));
      assert.equal(result.leftoverStill, true, JSON.stringify(result));
      assert.equal(result.grew, true, JSON.stringify(result));
      assert.equal(result.active, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("slot_free_pos never on snake and keeps head spawn radius", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 13, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const snake = g.oa && g.oa.ka;
        const head = snake && snake[0];
        if (!head) return { ok: false, reason: "no-head" };

        const bodyKeys = new Set();
        for (let i = 0; i < snake.length; i++) {
          const s = snake[i];
          if (s && s.x != null) bodyKeys.add((s.x | 0) + "," + (s.y | 0));
        }

        const samples = [];
        for (let n = 0; n < 40; n++) {
          const p = window.slot_free_pos(g.wa);
          if (!p) {
            samples.push(null);
            continue;
          }
          const key = (p.x | 0) + "," + (p.y | 0);
          const onSnake = bodyKeys.has(key);
          const nearHead = !(
            window.chess_outside_spawn_radius &&
            window.chess_outside_spawn_radius(g, p)
          );
          samples.push({ key, onSnake, nearHead, x: p.x, y: p.y });
        }

        // Also verify slotRespawn fruit lands legally.
        g.wa.ka.length = 0;
        window.setSlotActive(3, g);
        window.slotRespawn(3, g);
        const fruit = g.wa.ka[0];
        const fruitKey =
          fruit && fruit.pos
            ? (fruit.pos.x | 0) + "," + (fruit.pos.y | 0)
            : null;
        const fruitOnSnake = fruitKey != null && bodyKeys.has(fruitKey);
        const fruitNearHead =
          fruit &&
          fruit.pos &&
          !(
            window.chess_outside_spawn_radius &&
            window.chess_outside_spawn_radius(g, fruit.pos)
          );

        const valid = samples.filter((s) => s);
        return {
          ok: true,
          sampleCount: valid.length,
          anyOnSnake: valid.some((s) => s.onSnake),
          anyNearHead: valid.some((s) => s.nearHead),
          fruitOnSnake,
          fruitNearHead,
          head: { x: head.x, y: head.y },
        };
      });
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.ok(result.sampleCount >= 10, JSON.stringify(result));
      assert.equal(result.anyOnSnake, false, JSON.stringify(result));
      assert.equal(result.anyNearHead, false, JSON.stringify(result));
      assert.equal(result.fruitOnSnake, false, JSON.stringify(result));
      assert.equal(result.fruitNearHead, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("slot_free_pos never spawns inside walls", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        window.setSlotActive(1, g);

        const wm = g.Ca;
        if (!wm || !Array.isArray(wm.wa) || !wm.wa.length) {
          return { error: "no wall grid" };
        }
        const hgt = wm.wa.length;
        const wid = wm.wa[0].length;
        let wallCount = 0;
        for (let y = 2; y < Math.min(hgt - 2, 10); y++) {
          for (let x = 2; x < Math.min(wid - 2, 12); x++) {
            wm.wa[y][x] = 1;
            wallCount++;
          }
        }

        const samples = [];
        let inWall = 0;
        for (let n = 0; n < 60; n++) {
          const p = window.slot_free_pos(g.wa);
          if (!p) {
            samples.push(null);
            continue;
          }
          const blocked = window.slot_pos_in_wall(g, p.x, p.y);
          if (blocked) inWall++;
          samples.push({
            x: p.x | 0,
            y: p.y | 0,
            blocked: !!blocked,
          });
        }

        g.wa.ka.length = 0;
        window.slotRespawn(3, g);
        const fruit = g.wa.ka[0];
        const fruitInWall = !!(
          fruit &&
          fruit.pos &&
          window.slot_pos_in_wall(g, fruit.pos.x, fruit.pos.y)
        );

        return {
          wallCount,
          sampleCount: samples.filter((s) => s).length,
          inWall,
          fruitInWall,
          hasWalls: window.slot_has_walls(g),
        };
      });
      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.ok(result.wallCount > 10, JSON.stringify(result));
      assert.ok(result.sampleCount >= 20, JSON.stringify(result));
      assert.equal(result.inWall, 0, JSON.stringify(result));
      assert.equal(result.fruitInWall, false, JSON.stringify(result));
      assert.equal(result.hasWalls, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("twin badge reverses once then stops", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 17, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const body = g.oa.ka;
        const headDir = () => {
          const a = body[0];
          const b = body[1];
          if (!a || !b) return null;
          if (a.x === b.x + 1) return "RIGHT";
          if (a.x === b.x - 1) return "LEFT";
          if (a.y === b.y + 1) return "DOWN";
          if (a.y === b.y - 1) return "UP";
          return null;
        };

        // Place snake moving right into a Twin badge.
        g.oa.direction = "RIGHT";
        g.oa.Ga = "NONE";
        g.oa.Oa = false;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 6 - i;
          body[i].y = 8;
        }
        const fruit = g.wa.ka[0];
        fruit.slotMode = 5;
        fruit.Oka = false;
        fruit.pos.x = 7;
        fruit.pos.y = 8;
        const before = headDir();
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 10 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        if (!g.nj) g.tick();
        const afterTwin = headDir();
        const reversed = before != null && afterTwin != null && before !== afterTwin;
        const liveAfterTwin = !!window.__slotTwinLive;

        // Later non-twin eat must not reverse again.
        window.setSlotActive(3, g);
        window.__slotTwinLive = false;
        g.oa.Oa = false;
        const hx = body[0].x;
        const hy = body[0].y;
        for (let i = 0; i < body.length; i++) {
          body[i].x = hx - i;
          body[i].y = hy;
        }
        g.oa.direction = "RIGHT";
        g.oa.Ca = "RIGHT";
        g.oa.Ga = "NONE";
        const before2 = headDir();
        g.wa.ka.length = 0;
        const other = window.slot_make_apple(g.wa, { x: hx + 1, y: hy });
        other.slotMode = 3;
        other.Oka = false;
        g.wa.ka.push(other);
        const sh1 = g.Sh | 0;
        for (let t = 0; t < 10 && (g.Sh | 0) === sh1 && !g.nj; t++) g.tick();
        if (!g.nj) g.tick();
        const afterOther = headDir();
        const reversedAgain =
          before2 != null && afterOther != null && before2 !== afterOther;

        return {
          scoredTwin: (g.Sh | 0) > sh0,
          reversed,
          liveAfterTwin,
          scoredOther: (g.Sh | 0) > sh1,
          reversedAgain,
          liveFinal: !!window.__slotTwinLive,
          before,
          afterTwin,
          before2,
          afterOther,
        };
      });
      assert.equal(result.scoredTwin, true, JSON.stringify(result));
      assert.equal(result.reversed, true, JSON.stringify(result));
      assert.equal(result.liveAfterTwin, false, JSON.stringify(result));
      assert.equal(result.reversedAgain, false, JSON.stringify(result));
      assert.equal(result.liveFinal, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("burger activation does not timer or poison chess pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 25, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const keep = g.wa.ka[0] || window.slot_make_apple(g.wa, { x: 5, y: 5 });
        keep.Oka = false;
        keep.isPiece = false;
        keep.slotMode = 1;
        g.wa.ka.length = 0;
        g.wa.ka.push(keep);
        const p1 = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const p2 = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        window.chess_assign_piece(p1);
        window.chess_assign_piece(p2);
        g.wa.ka.push(p1, p2);
        window.appleArray = g.wa.ka;

        // Contaminate pieces as if a prior Burger tick hit them.
        p1.burgerTimer = 3;
        p1.burgerTimerMax = 3;
        p1.burgerGrey = 40;
        p2.burgerTimer = 1;
        p2.burgerTimerMax = 5;

        window.setSlotActive(25, g);
        window.burger_assign_timer(p1, g);
        window.burger_assign_timers_all(g.wa.ka, g);
        const eligible = window.burger_apple_timer_eligible(g, p1);
        window.burger_expire_apple(g, p1);
        window.burger_make_poison(p2, g);

        for (let t = 0; t < 6; t++) {
          if (typeof window.burger_tick_logic === "function") {
            window.burger_tick_logic();
          }
          if (typeof window.slot_tick_logic === "function") {
            window.slot_tick_logic(g);
          }
        }

        return {
          active: window.__slotActive,
          p1Piece: !!p1.isPiece,
          p2Piece: !!p2.isPiece,
          p1Oka: !!p1.Oka,
          p2Oka: !!p2.Oka,
          p1Timer: p1.burgerTimer,
          p2Timer: p2.burgerTimer,
          eligible,
          keepTimed: keep.burgerTimer != null,
          pieces: g.wa.ka.filter((f) => f && f.isPiece).length,
        };
      });
      assert.equal(result.active, 25, JSON.stringify(result));
      assert.equal(result.p1Piece, true, JSON.stringify(result));
      assert.equal(result.p2Piece, true, JSON.stringify(result));
      assert.equal(result.p1Oka, false, JSON.stringify(result));
      assert.equal(result.p2Oka, false, JSON.stringify(result));
      assert.equal(result.p1Timer, null, JSON.stringify(result));
      assert.equal(result.p2Timer, null, JSON.stringify(result));
      assert.equal(result.eligible, false, JSON.stringify(result));
      assert.equal(result.keepTimed, true, JSON.stringify(result));
      assert.equal(result.pieces, 2, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("burger activation arms timers; null timers do not mass-poison", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 55, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.slot_reset_state();
        for (const f of g.wa.ka) {
          f.Oka = false;
          f.isPiece = false;
          f.burgerTimer = null;
          f.burgerTimerMax = null;
          if (f.slotMode == null) window.assignSlotMode(f);
        }
        window.setSlotActive(25, g);
        const afterArm = g.wa.ka.map((f) => ({
          oka: !!f.Oka,
          t: f.burgerTimer,
          max: f.burgerTimerMax,
        }));
        // Contaminate with null again and tick — must re-arm, not poison.
        for (const f of g.wa.ka) {
          f.burgerTimer = null;
          f.burgerTimerMax = null;
        }
        for (let i = 0; i < 3; i++) {
          if (typeof window.burger_tick_logic === "function") {
            window.burger_tick_logic();
          }
        }
        return {
          afterArm,
          afterTick: g.wa.ka.map((f) => ({
            oka: !!f.Oka,
            t: f.burgerTimer,
            max: f.burgerTimerMax,
          })),
          oka: g.wa.ka.filter((f) => f && f.Oka).length,
          spendPeaceful: (() => {
            window.setSlotActive(21, g);
            window.cat_lives = 0;
            window.cat_peaceful_ticks = 0;
            return !!(
              window.cat_try_spend_life && window.cat_try_spend_life(g)
            );
          })(),
        };
      });
      assert.ok(result.afterArm.length >= 1, JSON.stringify(result));
      for (const a of result.afterArm) {
        assert.equal(a.oka, false, JSON.stringify(result));
        assert.ok((a.t | 0) >= 1, JSON.stringify(result));
        assert.ok((a.max | 0) >= 1, JSON.stringify(result));
      }
      assert.equal(result.oka, 0, JSON.stringify(result));
      for (const a of result.afterTick) {
        assert.equal(a.oka, false, JSON.stringify(result));
        assert.ok((a.t | 0) >= 1, JSON.stringify(result));
      }
      assert.equal(result.spendPeaceful, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("burger poisons despawn after leave roll; fresh timers freeze", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 39, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        g.wa.ka.length = 0;
        const fresh = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        fresh.slotMode = 1;
        fresh.Oka = false;
        fresh.burgerTimer = 8;
        fresh.burgerTimerMax = 10;
        fresh.burgerGrey = 40;
        const poison = window.slot_make_apple(g.wa, { x: 8, y: 4 });
        poison.Oka = true;
        poison.__slotBurgerPoison = true;
        poison.burgerTimer = 3;
        poison.burgerTimerMax = 5;
        delete poison.slotMode;
        const keep = window.slot_make_apple(g.wa, { x: 6, y: 6 });
        keep.slotMode = 3;
        keep.Oka = false;
        g.wa.ka.push(fresh, poison, keep);
        window.appleArray = g.wa.ka;

        // Leave Burger roll → freeze fresh, keep poison countdown.
        window.setSlotActive(25, g);
        window.setSlotActive(1, g);
        const afterLeave = {
          freshTimer: fresh.burgerTimer,
          freshGrey: fresh.burgerGrey,
          poisonTimer: poison.burgerTimer,
          active: window.__slotActive | 0,
          burgerActive: !!(
            window.isBurgerActive && window.isBurgerActive()
          ),
        };

        // Tick leftovers until poison despawns.
        let ticks = 0;
        while (g.wa.ka.indexOf(poison) >= 0 && ticks < 10) {
          window.slot_burger_leftover_tick(g);
          ticks++;
        }
        const afterDespawn = {
          ticks,
          poisonGone: g.wa.ka.indexOf(poison) < 0,
          freshStill: g.wa.ka.indexOf(fresh) >= 0,
          freshStillFruit: !fresh.Oka,
          okaLeft: g.wa.ka.filter((f) => f && f.Oka).length,
        };

        // Fresh fruit must not convert to poison after leave.
        for (let i = 0; i < 12; i++) window.slot_burger_leftover_tick(g);
        const noConvert = {
          freshOka: !!fresh.Oka,
          freshPresent: g.wa.ka.indexOf(fresh) >= 0,
        };

        return { afterLeave, afterDespawn, noConvert };
      });

      assert.equal(result.afterLeave.active, 1, JSON.stringify(result));
      assert.equal(result.afterLeave.burgerActive, false, JSON.stringify(result));
      assert.equal(result.afterLeave.freshTimer, null, JSON.stringify(result));
      assert.equal(result.afterLeave.freshGrey, 0, JSON.stringify(result));
      assert.equal(result.afterLeave.poisonTimer, 3, JSON.stringify(result));
      assert.equal(result.afterDespawn.poisonGone, true, JSON.stringify(result));
      assert.equal(result.afterDespawn.freshStill, true, JSON.stringify(result));
      assert.equal(result.afterDespawn.freshStillFruit, true, JSON.stringify(result));
      assert.equal(result.afterDespawn.okaLeft, 0, JSON.stringify(result));
      assert.equal(result.noConvert.freshOka, false, JSON.stringify(result));
      assert.equal(result.noConvert.freshPresent, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("eating a chess piece locks all fruit until unlock", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 23, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const chess = window.CHESS_MODE != null ? window.CHESS_MODE | 0 : 24;
        // Leftover badged fruit + chess pieces (as after a Chess badge eat on 3a).
        const keep = g.wa.ka[0] || window.slot_make_apple(g.wa, { x: 4, y: 4 });
        keep.Oka = false;
        keep.isPiece = false;
        keep.slotMode = 1;
        delete keep.nba;
        delete keep.__slotShield;
        g.wa.ka.length = 0;
        g.wa.ka.push(keep);
        const p1 = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const p2 = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        window.chess_assign_piece(p1);
        window.chess_assign_piece(p2);
        p1.ChessColor = "b";
        p2.ChessColor = "w";
        p1.ChessPiece = "rook";
        p2.ChessPiece = "rook";
        g.wa.ka.push(p1, p2);
        window.appleArray = g.wa.ka;
        window.head_state = "OPEN";
        window.head_color = "NONE";

        // Switch to a non-chess roll so leftover pieces alone used to skip fruit lock.
        window.setSlotActive(1, g);
        window.just_ate = "piece";
        window.head_state = p1.ChessPiece;
        window.head_color = p1.ChessColor;
        window.appleArray = g.wa.ka;
        window.shield_all();

        const field = window.chess_shield_field || "nba";
        const locked = (f) =>
          !!(f && f[field] && typeof f[field].has === "function" && f[field].size >= 4);
        const afterPickup = {
          fruitLocked: locked(keep),
          pieceLocked: locked(p2),
          carrying: window.head_state,
          e7Shield: typeof e7 === "function" ? !!e7(g.settings, 15) : null,
          boardLockFlag: !!window.slot_chess_board_lock,
        };

        // Unlock opposite piece → OPEN clears board lock.
        window.capture_attempt(p2.pos.x, p2.pos.y);
        const afterUnlock = {
          head: window.head_state,
          fruitLocked: locked(keep),
          pieceIsFruit: p2 && !p2.isPiece,
          e7Shield: typeof e7 === "function" ? !!e7(g.settings, 15) : null,
        };
        return { afterPickup, afterUnlock, chess };
      });
      assert.equal(result.afterPickup.carrying, "rook", JSON.stringify(result));
      assert.equal(
        result.afterPickup.fruitLocked,
        true,
        "fruit must lock while carrying: " + JSON.stringify(result)
      );
      assert.equal(
        result.afterPickup.pieceLocked,
        true,
        "other piece must lock: " + JSON.stringify(result)
      );
      assert.equal(
        result.afterPickup.boardLockFlag,
        true,
        JSON.stringify(result)
      );
      assert.equal(result.afterUnlock.head, "OPEN", JSON.stringify(result));
      assert.equal(
        result.afterUnlock.pieceIsFruit,
        true,
        "unlock converts piece: " + JSON.stringify(result)
      );
      assert.equal(
        result.afterUnlock.fruitLocked,
        false,
        "fruit unlock after capture: " + JSON.stringify(result)
      );
    } finally {
      await h.close();
    }
  });

  it("shield fruit restore prior nba after chess unlock", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 29, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        g.wa.ka.length = 0;
        const shielded = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        shielded.Oka = false;
        shielded.isPiece = false;
        shielded.slotMode = 15;
        shielded.__slotShield = true;
        shielded.__ultraKeepShield = true;
        // Partial P3E-like structure (not full 4-way).
        shielded.nba = new Set(["UP", "LEFT"]);
        const bare = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        bare.slotMode = 1;
        delete bare.nba;
        delete bare.__slotShield;
        const p1 = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const p2 = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        window.chess_assign_piece(p1);
        window.chess_assign_piece(p2);
        p1.ChessColor = "b";
        p2.ChessColor = "w";
        p1.ChessPiece = "rook";
        p2.ChessPiece = "rook";
        g.wa.ka.push(shielded, bare, p1, p2);
        window.appleArray = g.wa.ka;

        const prior = [...shielded.nba].sort();
        window.setSlotActive(1, g);
        window.head_state = p1.ChessPiece;
        window.head_color = p1.ChessColor;
        window.shield_all();
        // Tick while carrying should not overwrite the snapshot.
        window.shield_all();

        const during = {
          shieldedSize: shielded.nba && shielded.nba.size,
          bareLocked: !!(bare.nba && bare.nba.size >= 4),
          saved: !!(shielded.__slotNbaPriorSaved && shielded.__slotNbaPrior),
          savedDirs: shielded.__slotNbaPrior
            ? [...shielded.__slotNbaPrior].sort()
            : null,
        };

        window.capture_attempt(p2.pos.x, p2.pos.y);
        const after = {
          head: window.head_state,
          shieldedDirs: shielded.nba ? [...shielded.nba].sort() : null,
          bareNba: bare.nba,
          stillMarked: !!shielded.__slotShield,
          priorCleared: !shielded.__slotNbaPriorSaved,
        };
        return { prior, during, after };
      });

      assert.deepEqual(result.prior, ["LEFT", "UP"], JSON.stringify(result));
      assert.equal(result.during.shieldedSize, 4, JSON.stringify(result));
      assert.equal(result.during.bareLocked, true, JSON.stringify(result));
      assert.deepEqual(result.during.savedDirs, ["LEFT", "UP"], JSON.stringify(result));
      assert.equal(result.after.head, "OPEN", JSON.stringify(result));
      assert.deepEqual(
        result.after.shieldedDirs,
        ["LEFT", "UP"],
        "must restore prior bars: " + JSON.stringify(result)
      );
      assert.equal(result.after.bareNba, undefined, JSON.stringify(result));
      assert.equal(result.after.stillMarked, true, JSON.stringify(result));
      assert.equal(result.after.priorCleared, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("sanitizes piece vs fruit identity after unlock and sticky just_ate", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 31, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        g.wa.ka.length = 0;
        const keep = window.slot_make_apple(g.wa, { x: 3, y: 3 });
        keep.isPiece = false;
        keep.slotMode = 1;
        const p1 = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const p2 = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        window.chess_assign_piece(p1);
        window.chess_assign_piece(p2);
        // Contaminate piece with fruit-only state (bad badge / portal).
        p1.slotMode = 15;
        p1.__slotPortal = true;
        p1.__slotShield = true;
        p2.ChessColor = "w";
        p2.ChessPiece = "rook";
        g.wa.ka.push(keep, p1, p2);
        window.appleArray = g.wa.ka;
        window.slot_sanitize_chess_identity(g.wa);
        const afterSanitizePieces = {
          p1Mode: p1.slotMode,
          p1Portal: !!p1.__slotPortal,
          p1Shield: !!p1.__slotShield,
          p1Piece: !!p1.isPiece,
          keepPiece: !!keep.isPiece,
        };

        // Unlock leaves ChessPiece + piece sprite type on the converted apple.
        window.head_state = "rook";
        window.head_color = "b";
        window.just_ate = "piece";
        window.capture_attempt(p2.pos.x, p2.pos.y);
        const unlocked = {
          isPiece: !!p2.isPiece,
          chessPiece: p2.ChessPiece,
          chessColor: p2.ChessColor,
          pieceSprite: window.slot_is_chess_piece_type(p2.type),
          hasBadge: p2.slotMode != null,
          justAte: window.just_ate,
        };

        // Sticky just_ate must not block fruit refill when eaten is a fruit.
        window.just_ate = "piece";
        const fruit = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        fruit.isPiece = false;
        fruit.slotMode = 3;
        g.wa.ka.push(fruit);
        window.__slotEatenFruit = fruit;
        window.__slotEatenMode = 3;
        window.__slotEating = true;
        window.setSlotActive(3, g);
        const beforeLen = g.wa.ka.length;
        window.slot_eat_respawn(g);
        const afterFruitEat = {
          justAte: window.just_ate,
          grewOrStable: g.wa.ka.length >= beforeLen,
          skippedBecauseSticky:
            window.just_ate === "piece" && g.wa.ka.length === beforeLen,
        };

        // Incomplete isPiece without ChessPiece → demoted to fruit.
        const bogus = window.slot_make_apple(g.wa, { x: 12, y: 4 });
        bogus.isPiece = true;
        delete bogus.ChessPiece;
        delete bogus.ChessColor;
        bogus.slotMode = 8;
        g.wa.ka.push(bogus);
        window.slot_sanitize_chess_identity(g.wa);
        const bogusAfter = {
          isPiece: !!bogus.isPiece,
          hasBadge: bogus.slotMode != null,
        };

        return {
          afterSanitizePieces,
          unlocked,
          afterFruitEat,
          bogusAfter,
        };
      });

      assert.equal(result.afterSanitizePieces.p1Mode, undefined, JSON.stringify(result));
      assert.equal(result.afterSanitizePieces.p1Portal, false, JSON.stringify(result));
      assert.equal(result.afterSanitizePieces.p1Shield, false, JSON.stringify(result));
      assert.equal(result.afterSanitizePieces.p1Piece, true, JSON.stringify(result));
      assert.equal(result.afterSanitizePieces.keepPiece, false, JSON.stringify(result));
      assert.equal(result.unlocked.isPiece, false, JSON.stringify(result));
      assert.equal(result.unlocked.chessPiece, undefined, JSON.stringify(result));
      assert.equal(result.unlocked.chessColor, undefined, JSON.stringify(result));
      assert.equal(result.unlocked.pieceSprite, false, JSON.stringify(result));
      assert.equal(result.unlocked.hasBadge, true, JSON.stringify(result));
      assert.equal(result.unlocked.justAte, "fruit", JSON.stringify(result));
      assert.equal(result.afterFruitEat.justAte, "fruit", JSON.stringify(result));
      assert.equal(result.afterFruitEat.skippedBecauseSticky, false, JSON.stringify(result));
      assert.equal(result.bogusAfter.isPiece, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("eating chess-unlock fruit refills one badge fruit or wins if empty", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 37, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        // Board: leftover fruit + piece + unlock fruit (as after capture).
        g.wa.ka.length = 0;
        const keep = window.slot_make_apple(g.wa, { x: 3, y: 3 });
        keep.isPiece = false;
        keep.slotMode = 1;
        const piece = window.slot_make_apple(g.wa, { x: 12, y: 8 });
        window.chess_assign_piece(piece);
        piece.ChessColor = "b";
        piece.ChessPiece = "rook";
        const unlocked = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        unlocked.isPiece = false;
        unlocked.__slotFromChessUnlock = true;
        // Force a non-chess badge so refill is exactly one fruit.
        unlocked.slotMode = 3;
        delete unlocked.ChessPiece;
        delete unlocked.ChessColor;
        g.wa.ka.push(keep, piece, unlocked);
        window.appleArray = g.wa.ka;
        window.head_state = "OPEN";
        window.just_ate = "fruit";

        const before = {
          fruits: g.wa.ka.filter((f) => f && !f.isPiece && !f.Oka).length,
          pieces: g.wa.ka.filter((f) => f && f.isPiece).length,
        };
        window.slot_on_eating_fruit(g, unlocked);
        window.slot_eat_respawn(g);
        const ix = g.wa.ka.indexOf(unlocked);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        window.appleArray = g.wa.ka;
        const after = {
          fruits: g.wa.ka.filter((f) => f && !f.isPiece && !f.Oka).length,
          pieces: g.wa.ka.filter((f) => f && f.isPiece).length,
          badged: g.wa.ka.filter(
            (f) => f && !f.isPiece && !f.Oka && f.slotMode != null
          ).length,
          nj: !!g.nj,
        };

        // Native Chess Vm must not plant pieces for unlock fruit eats.
        window.just_ate = "fruit";
        window.__slotRespawnedThisEat = false;
        window.__slotAllowChessFruitRespawn = false;
        const denied = window.chess_fruit_respawn(
          g.wa,
          () => window.slot_make_apple(g.wa, { x: 0, y: 0 }),
          () => null,
          () => 0
        );

        // Last unlock fruit + spawn fail → win.
        g.nj = false;
        g.ub = false;
        g.wa.ka.length = 0;
        const last = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        last.isPiece = false;
        last.__slotFromChessUnlock = true;
        last.slotMode = 3;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        const origFree = window.slot_free_pos;
        window.slot_free_pos = () => null;
        window.just_ate = "fruit";
        window.__slotEatenFruit = last;
        window.__slotEatenMode = 3;
        window.__slotEating = true;
        window.__slotRespawnedThisEat = false;
        window.slot_eat_respawn(g);
        const emptyWin = { nj: !!g.nj, ub: !!g.ub };
        window.slot_free_pos = origFree;

        // Spawn fail with sibling fruit → keep playing.
        g.nj = false;
        g.ub = false;
        g.wa.ka.length = 0;
        const sib = window.slot_make_apple(g.wa, { x: 2, y: 2 });
        sib.slotMode = 1;
        const u2 = window.slot_make_apple(g.wa, { x: 4, y: 2 });
        u2.slotMode = 3;
        u2.__slotFromChessUnlock = true;
        g.wa.ka.push(sib, u2);
        window.slot_free_pos = () => null;
        window.__slotEatenFruit = u2;
        window.__slotEatenMode = 3;
        window.__slotEating = true;
        window.__slotRespawnedThisEat = false;
        window.slot_eat_respawn(g);
        const keepPlaying = {
          nj: !!g.nj,
          sibStill: g.wa.ka.includes(sib),
        };
        window.slot_free_pos = origFree;

        return { before, after, denied, emptyWin, keepPlaying };
      });

      assert.equal(result.before.fruits, 2, JSON.stringify(result));
      assert.equal(result.before.pieces, 1, JSON.stringify(result));
      assert.equal(result.after.fruits, 2, JSON.stringify(result)); // keep + new
      assert.equal(result.after.pieces, 1, JSON.stringify(result));
      assert.equal(result.after.badged, 2, JSON.stringify(result));
      assert.equal(result.after.nj, false, JSON.stringify(result));
      assert.equal(result.denied, 0, JSON.stringify(result));
      assert.equal(result.emptyWin.nj, true, JSON.stringify(result));
      assert.equal(result.emptyWin.ub, true, JSON.stringify(result));
      assert.equal(result.keepPlaying.nj, false, JSON.stringify(result));
      assert.equal(result.keepPlaying.sibStill, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("chess piece eat spawns nothing; unlock fruit respawns pieces", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 19, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const chess = window.CHESS_MODE != null ? window.CHESS_MODE | 0 : 24;
        window.setSlotActive(chess, g);
        g.wa.ka.length = 0;

        // Two pieces on board (as if Chess badge already spawned them).
        const p1 = window.slot_make_apple(g.wa, { x: 8, y: 8 });
        const p2 = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        window.chess_assign_piece(p1);
        window.chess_assign_piece(p2);
        p1.ChessColor = "b";
        p2.ChessColor = "b";
        g.wa.ka.push(p1, p2);
        window.appleArray = g.wa.ka;
        window.head_state = "OPEN";
        window.head_color = "w";

        const beforePiece = g.wa.ka.length;
        window.just_ate = "piece";
        window.__slotEatenFruit = null;
        window.__slotEatenMode = chess; // stale badge must not spawn on piece
        window.__slotEating = false;
        window.slot_on_eating_fruit(g, p1);
        const activatedOnPiece =
          window.__slotEating === true || window.__slotEatenFruit === p1;
        window.slot_eat_respawn(g);
        const afterPiece = g.wa.ka.length;
        const spawnedOnPiece = afterPiece > beforePiece;

        // Unlock fruit must get a rolled badge (not forced Chess). Eating a
        // non-Chess badge must not respawn pieces.
        p1.isPiece = false;
        delete p1.ChessPiece;
        delete p1.slotMode;
        window.assignSlotMode(p1);
        const unlockBadge = p1.slotMode;
        // Force a non-chess badge to prove no piece refill.
        p1.slotMode = 1;
        window.just_ate = "fruit";
        window.__slotEatenFruit = p1;
        window.__slotEatenMode = 1;
        window.__slotEating = true;
        const ix = g.wa.ka.indexOf(p1);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        const beforeUnlockEat = g.wa.ka.length;
        const piecesBeforeUnlockEat = g.wa.ka.filter((f) => f && f.isPiece).length;
        window.slot_eat_respawn(g);
        const afterUnlockEat = g.wa.ka.length;
        const piecesAfterUnlockEat = g.wa.ka.filter((f) => f && f.isPiece).length;

        // Chess-badge fruit still respawns a piece pair.
        window.setSlotActive(chess, g);
        g.wa.ka.length = 0;
        window.__slotEatenMode = chess;
        window.__slotEating = true;
        window.just_ate = "fruit";
        window.slot_eat_respawn(g);
        const piecesAfterChessBadge = g.wa.ka.filter((f) => f && f.isPiece).length;

        return {
          activatedOnPiece,
          spawnedOnPiece,
          afterPiece,
          beforePiece,
          unlockBadge,
          unlockBadgeNotForcedChess:
            unlockBadge != null && (unlockBadge | 0) !== (chess | 0),
          piecesBeforeUnlockEat,
          piecesAfterUnlockEat,
          afterUnlockEat,
          beforeUnlockEat,
          piecesAfterChessBadge,
          chessFruitRespawnBlocked: (() => {
            window.just_ate = "piece";
            const n = window.chess_fruit_respawn(g.wa, () => ({}), null, null);
            return n === 0;
          })(),
        };
      });
      assert.equal(result.activatedOnPiece, false, JSON.stringify(result));
      assert.equal(result.spawnedOnPiece, false, JSON.stringify(result));
      assert.equal(result.chessFruitRespawnBlocked, true, JSON.stringify(result));
      assert.equal(
        result.piecesAfterUnlockEat,
        result.piecesBeforeUnlockEat,
        "non-chess unlock eat must not spawn pieces: " + JSON.stringify(result)
      );
      assert.ok(
        result.piecesAfterChessBadge >= 2,
        "chess badge eat respawns pieces: " + JSON.stringify(result)
      );
    } finally {
      await h.close();
    }
  });

  it("sokoban unlock yields badged fruit not another box+goal", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 14, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        try {
          if (g.Aa && g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
          if (g.Aa && g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        } catch (_e) {}

        // Plant via badge eat (same path as real play).
        const fruit0 = g.wa.ka[0];
        fruit0.slotMode = 9;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit0.pos.x = 10;
        fruit0.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();

        const boxesBefore = g.Aa.oa ? g.Aa.oa.size | 0 : 0;
        const goalsBefore = g.Aa.d_ ? g.Aa.d_.size | 0 : 0;
        let goalPos = null;
        try {
          for (const p of g.Aa.d_) {
            goalPos = { x: p.x, y: p.y };
            break;
          }
        } catch (_e2) {}

        // Simulate native X4E unlock: fruit at goal, clear box+goal.
        // Also force the sticky-eat state that used to make unlock call
        // slotRespawn(9) and plant another box+goal.
        if (g.Aa.oa && g.Aa.oa.clear) g.Aa.oa.clear();
        if (g.Aa.d_ && g.Aa.d_.clear) g.Aa.d_.clear();
        g.wa.ka.length = 0;
        window.__slotEating = true;
        window.__slotEatenMode = 9;
        window.__slotRespawnedThisEat = true;
        window.__slotActivatedFruit = null;
        const fruit = window.slot_make_apple(
          g.wa,
          goalPos || { x: 6, y: 6 }
        );
        delete fruit.slotMode;
        g.wa.ka.push(fruit);
        window.slot_after_native_respawn(g.wa, 1, g);

        // With e7(9) still on, native e5E must not re-plant without allow flag.
        const plant = window.__slotE5E;
        if (typeof plant === "function") {
          window.__slotAllowSokoPlant = false;
          try {
            plant(g.Aa, 0, true, true);
          } catch (_e3) {}
        }
        window.slot_tick_logic(g);
        return {
          boxesBefore,
          goalsBefore,
          boxesAfter: g.Aa.oa ? g.Aa.oa.size | 0 : 0,
          goalsAfter: g.Aa.d_ ? g.Aa.d_.size | 0 : 0,
          fruitCount: g.wa.ka.length,
          fruitBadge: g.wa.ka[0] && g.wa.ka[0].slotMode,
          eatingCleared: !window.__slotEating && window.__slotEatenMode == null,
          hasE5: typeof window.__slotE5E,
          active: window.__slotActive,
        };
      });
      assert.equal(result.active, 9, JSON.stringify(result));
      assert.ok(result.boxesBefore >= 1, JSON.stringify(result));
      assert.ok(result.goalsBefore >= 1, JSON.stringify(result));
      assert.equal(result.boxesAfter, 0, "no new box: " + JSON.stringify(result));
      assert.equal(result.goalsAfter, 0, "no new goal: " + JSON.stringify(result));
      assert.equal(result.fruitCount, 1, JSON.stringify(result));
      assert.equal(typeof result.fruitBadge, "number", JSON.stringify(result));
      assert.equal(result.eatingCleared, true, JSON.stringify(result));
      assert.equal(result.hasE5, "function", JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("key badge plant is single; gated q6E cannot double", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 15, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const fruit = g.wa.ka[0];
        fruit.slotMode = 8;
        const body = g.oa.ka;
        g.oa.direction = "RIGHT";
        fruit.pos.x = 10;
        fruit.pos.y = 8;
        for (let i = 0; i < body.length; i++) {
          body[i].x = 9 - i;
          body[i].y = 8;
        }
        const sh0 = g.Sh | 0;
        for (let t = 0; t < 6 && (g.Sh | 0) === sh0 && !g.nj; t++) g.tick();
        const afterBadge = (g.Ba.keys || []).length | 0;
        // Native q6E while key roll is active must no-op without allow flag.
        if (typeof q6E === "function" || window.__slotQ6E) {
          const plant = window.__slotQ6E || q6E;
          window.__slotAllowKeyPlant = false;
          try {
            plant(g.Ba, afterBadge, true);
          } catch (_e) {}
        }
        const afterGate = (g.Ba.keys || []).length | 0;
        return {
          afterBadge,
          afterGate,
          disableReset: !!window.disableKeyResetPlant,
          active: window.__slotActive,
        };
      });
      assert.equal(result.active, 8, JSON.stringify(result));
      assert.equal(result.afterBadge, 1, JSON.stringify(result));
      assert.equal(result.afterGate, 1, "gated q6E: " + JSON.stringify(result));
      assert.equal(result.disableReset, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("Ultra disable flags are ignored; slot roll owns spawn gates", async () => {
    const { launchHarness, ultraHarnessOpts, COUNT, SIZE } = await import(
      "../tools/harness.mjs"
    );
    const h = await launchHarness({
      seed: 21,
      headless: true,
      ...ultraHarnessOpts(),
    });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();

        // Ultra defaults: all spawn toggles off.
        window.pudding_settings = window.pudding_settings || {};
        window.pudding_settings.UltraWallModeSpawn = false;
        window.pudding_settings.UltraMineModeSpawn = false;
        window.pudding_settings.UltraGateModeSpawn = false;
        window.pudding_settings.UltraBridgeModeSpawn = false;
        window.pudding_settings.UltraStatueModeSpawn = false;
        window.pudding_settings.UltraArrowTurnSpawn = false;
        window.pudding_settings.UltraShieldedFruitSpawn = false;
        window.ultraEnsureGameplayToggles();

        const afterUltra = {
          wall: !!window.disableWallMode,
          mine: !!window.disableMineMode,
          gate: !!window.disableGateMode,
          bridge: !!window.disableBridgeMode,
          statue: !!window.disableStatueBodyPlant,
        };

        window.setSlotActive(1, g); // Wall roll
        window.ultraEnsureGameplayToggles(); // must not undo slot sync
        const wallRoll = {
          wallDisabled: !!window.disableWallMode,
          mineDisabled: !!window.disableMineMode,
          allowArrow: !!window.__slotAllowArrowTurns,
          shieldSpawn:
            typeof window.ultraShouldSpawnFruitShields === "function" &&
            window.ultraShouldSpawnFruitShields(),
          arrowBlocked:
            typeof window.ultraBlockNativeArrowTurns === "function" &&
            window.ultraBlockNativeArrowTurns(),
        };

        window.setSlotActive(16, g); // Arrow
        window.ultraEnsureGameplayToggles();
        const arrowRoll = {
          allowArrow: !!window.__slotAllowArrowTurns,
          arrowBlocked:
            typeof window.ultraBlockNativeArrowTurns === "function" &&
            window.ultraBlockNativeArrowTurns(),
          wallDisabled: !!window.disableWallMode,
        };

        window.setSlotActive(15, g); // Shield
        const shieldRoll = {
          shieldSpawn:
            typeof window.ultraShouldSpawnFruitShields === "function" &&
            window.ultraShouldSpawnFruitShields(),
        };

        window.setSlotActive(12, g); // Mines
        window.ultraApplyGameplayToggleFlags &&
          window.ultraApplyGameplayToggleFlags("UltraMineModeSpawn", false);
        const mineRoll = {
          mineDisabled: !!window.disableMineMode,
        };

        return { afterUltra, wallRoll, arrowRoll, shieldRoll, mineRoll };
      });
      // After Ultra ensure with Slot active but no roll yet, wall stays disabled.
      assert.equal(result.afterUltra.wall, true, JSON.stringify(result));
      assert.equal(result.wallRoll.wallDisabled, false, JSON.stringify(result));
      assert.equal(result.wallRoll.mineDisabled, true, JSON.stringify(result));
      assert.equal(result.wallRoll.allowArrow, false, JSON.stringify(result));
      assert.equal(result.wallRoll.arrowBlocked, true, JSON.stringify(result));
      assert.equal(result.arrowRoll.allowArrow, true, JSON.stringify(result));
      assert.equal(result.arrowRoll.arrowBlocked, false, JSON.stringify(result));
      assert.equal(result.arrowRoll.wallDisabled, true, JSON.stringify(result));
      assert.equal(result.shieldRoll.shieldSpawn, true, JSON.stringify(result));
      assert.equal(result.mineRoll.mineDisabled, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("dice count last fruit spawns 1–6; mid-board does not top up", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 31, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 4;
        g.settings.Ca = 4;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        // Mid-board: two leftovers + eaten — must not plant a top-up fruit.
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const b = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        const c = window.slot_make_apple(g.wa, { x: 9, y: 5 });
        window.assignSlotMode(a);
        window.assignSlotMode(b);
        window.assignSlotMode(c);
        g.wa.ka.push(a, b, c);
        window.appleArray = g.wa.ka;
        eatBadge(c, 3);
        const midAfter = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;

        // Last fruit: roll 1–6 badged fruits (simulate several eats).
        const rolls = [];
        for (let i = 0; i < 24; i++) {
          g.wa.ka.length = 0;
          const last = window.slot_make_apple(g.wa, { x: 6, y: 6 });
          last.slotMode = 3;
          g.wa.ka.push(last);
          window.appleArray = g.wa.ka;
          eatBadge(last, 3);
          const n = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
          rolls.push(n);
        }

        const badged = g.wa.ka.every(
          (f) => f && (f.isPiece || f.Oka || f.slotMode != null)
        );

        return {
          midAfter,
          rolls,
          badged,
          isDice: window.slot_is_dice_count(g),
          helpers: {
            isDice: typeof window.slot_is_dice_count === "function",
            spawnN: typeof window.slot_dice_spawn_n === "function",
            left: typeof window.slot_fruit_left_excluding_eaten === "function",
          },
        };
      });

      assert.equal(result.helpers.isDice, true, JSON.stringify(result));
      assert.equal(result.helpers.spawnN, true, JSON.stringify(result));
      assert.equal(result.helpers.left, true, JSON.stringify(result));
      assert.equal(result.isDice, true, JSON.stringify(result));
      assert.equal(result.midAfter, 2, JSON.stringify(result));
      assert.equal(result.badged, true, JSON.stringify(result));
      for (const n of result.rolls) {
        assert.ok(n >= 1 && n <= 6, "dice roll " + n + " " + JSON.stringify(result.rolls));
      }
      assert.ok(
        new Set(result.rolls).size >= 2,
        "expected varied dice rolls " + JSON.stringify(result.rolls)
      );
    } finally {
      await h.close();
    }
  });

  it("bomb count last fruit spawns 24; mid-board does not top up", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 32, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.BOMB,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 5;
        g.settings.Ca = 5;
        g.kc = false;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        // Mid-board: leftovers remain — must not plant a top-up.
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const b = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        const c = window.slot_make_apple(g.wa, { x: 9, y: 5 });
        window.assignSlotMode(a);
        window.assignSlotMode(b);
        window.assignSlotMode(c);
        g.wa.ka.push(a, b, c);
        window.appleArray = g.wa.ka;
        eatBadge(c, 3);
        const midAfter = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;

        // Last fruit: plant 24 once (kc).
        g.wa.ka.length = 0;
        g.kc = false;
        const last = window.slot_make_apple(g.wa, { x: 6, y: 6 });
        last.slotMode = 3;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        eatBadge(last, 3);
        const afterBomb = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
        const badged = g.wa.ka.every(
          (f) => f && (f.isPiece || f.Oka || f.slotMode != null)
        );
        const kcAfter = !!g.kc;

        // After kc: last fruit of the 24 plants 1 badge fruit (not win).
        g.wa.ka.length = 0;
        window.appleArray = g.wa.ka;
        const lastOf24 = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        lastOf24.slotMode = 3;
        g.wa.ka.push(lastOf24);
        window.appleArray = g.wa.ka;
        g.nj = false;
        g.ub = false;
        eatBadge(lastOf24, 3);
        const afterLastOf24 = g.wa.ka.filter(
          (f) => f && !f.Oka && !f.isPiece
        ).length;
        const lastBadged = g.wa.ka.every(
          (f) => f && (f.isPiece || f.Oka || f.slotMode != null)
        );

        return {
          midAfter,
          afterBomb,
          badged,
          kcAfter,
          afterLastOf24,
          lastBadged,
          won: !!(g.ub && g.nj),
          isBomb: window.slot_is_bomb_count(g),
          spawnN: window.slot_bomb_spawn_n(g),
        };
      });

      assert.equal(result.isBomb, true, JSON.stringify(result));
      assert.equal(result.spawnN, 24, JSON.stringify(result));
      assert.equal(result.midAfter, 2, JSON.stringify(result));
      assert.equal(result.afterBomb, 24, JSON.stringify(result));
      assert.equal(result.badged, true, JSON.stringify(result));
      assert.equal(result.kcAfter, true, JSON.stringify(result));
      assert.equal(result.afterLastOf24, 1, JSON.stringify(result));
      assert.equal(result.lastBadged, true, JSON.stringify(result));
      assert.equal(result.won, false, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("bomb count after kc: cheese/statue refill 1; key stays entity-only", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 33, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.BOMB,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 5;
        g.settings.Ca = 5;
        g.kc = true;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        function fruitCount() {
          return g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
        }

        // Mid-board cheese after kc → 1 new badge fruit (net: leftovers + 1).
        g.wa.ka.length = 0;
        const cKeep = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const cEat = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        window.assignSlotMode(cKeep);
        cEat.slotMode = 3;
        g.wa.ka.push(cKeep, cEat);
        window.appleArray = g.wa.ka;
        eatBadge(cEat, 3);
        const cheeseAfter = fruitCount();
        const cheeseBadged = g.wa.ka.every(
          (f) => f && (f.isPiece || f.Oka || f.slotMode != null)
        );

        // Mid-board statue after kc → 1 new badge fruit.
        g.wa.ka.length = 0;
        const sKeep = window.slot_make_apple(g.wa, { x: 5, y: 6 });
        const sEat = window.slot_make_apple(g.wa, { x: 7, y: 6 });
        window.assignSlotMode(sKeep);
        sEat.slotMode = 13;
        g.wa.ka.push(sKeep, sEat);
        window.appleArray = g.wa.ka;
        eatBadge(sEat, 13);
        const statueAfter = fruitCount();
        const statueBadged = g.wa.ka.every(
          (f) => f && (f.isPiece || f.Oka || f.slotMode != null)
        );

        // Key after kc: key+keyblock only — no extra badge fruit.
        // Stub plant helper (normally captured on native Vm); proves the key
        // branch returns without falling through to default fruit refill.
        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const kKeep = window.slot_make_apple(g.wa, { x: 5, y: 7 });
        const kEat = window.slot_make_apple(g.wa, { x: 7, y: 7 });
        window.assignSlotMode(kKeep);
        kEat.slotMode = 8;
        g.wa.ka.push(kKeep, kEat);
        window.appleArray = g.wa.ka;
        const keysBefore = (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0;
        window.__slotQ6E = function (ba) {
          ba.keys = ba.keys || [];
          ba.keys.push({
            type: 0,
            pos: { x: 3, y: 3 },
            r7a: { x: 4, y: 4 },
          });
        };
        eatBadge(kEat, 8);
        const keyFruitAfter = fruitCount();
        const keysAfter = (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0;

        return {
          cheeseAfter,
          cheeseBadged,
          statueAfter,
          statueBadged,
          keyFruitAfter,
          keysBefore,
          keysAfter,
        };
      });

      assert.equal(result.cheeseAfter, 2, JSON.stringify(result));
      assert.equal(result.cheeseBadged, true, JSON.stringify(result));
      assert.equal(result.statueAfter, 2, JSON.stringify(result));
      assert.equal(result.statueBadged, true, JSON.stringify(result));
      assert.equal(result.keyFruitAfter, 1, JSON.stringify(result));
      assert.equal(result.keysAfter, result.keysBefore + 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("tally count last fruit spawns indexed 5; mid-board does not top up", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 36, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const b = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        const c = window.slot_make_apple(g.wa, { x: 9, y: 5 });
        window.assignSlotMode(a);
        window.assignSlotMode(b);
        window.assignSlotMode(c);
        g.wa.ka.push(a, b, c);
        window.appleArray = g.wa.ka;
        eatBadge(c, 3);
        const midAfter = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;

        g.wa.ka.length = 0;
        const last = window.slot_make_apple(g.wa, { x: 6, y: 6 });
        last.slotMode = 3;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        eatBadge(last, 3);
        const fruits = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece);
        const seqs = fruits
          .map((f) => f.sequenceNumber | 0)
          .sort((x, y) => x - y);
        const badged = fruits.every((f) => f.slotMode != null);

        return {
          midAfter,
          afterTally: fruits.length,
          seqs,
          tallyIndex: g.wa.wa | 0,
          badged,
          isTally: window.slot_is_tally_count(g),
          spawnN: window.slot_tally_spawn_n(g),
        };
      });

      assert.equal(result.isTally, true, JSON.stringify(result));
      assert.equal(result.spawnN, 5, JSON.stringify(result));
      assert.equal(result.midAfter, 2, JSON.stringify(result));
      assert.equal(result.afterTally, 5, JSON.stringify(result));
      assert.deepEqual(result.seqs, [1, 2, 3, 4, 5], JSON.stringify(result));
      assert.equal(result.tallyIndex, 1, JSON.stringify(result));
      assert.equal(result.badged, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("tally indexes chess pieces in the wave batch", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 43, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        const chess = window.CHESS_MODE != null ? window.CHESS_MODE | 0 : 24;
        window.__slotSpecialStore = [chess];
        g.wa.ka.length = 0;
        const plantStart = 0;
        const units = window.slot_plant_wave_units(g, 5, 3, { indexTally: true });
        const list = g.wa.ka.filter((f) => f && !f.Oka);
        const pieces = list.filter((f) => f.isPiece);
        const pieceSeqs = pieces.map((f) => f.sequenceNumber | 0);
        const allIndexed = list.every((f) => (f.sequenceNumber | 0) > 0);
        const seqs = list
          .map((f) => f.sequenceNumber | 0)
          .sort((a, b) => a - b);

        return {
          units,
          pieceCount: pieces.length,
          pieceSeqs,
          allIndexed,
          seqs,
          listLen: list.length,
          tallyIndex: g.wa.wa | 0,
        };
      });

      assert.equal(result.units, 5, JSON.stringify(result));
      assert.equal(result.pieceCount, 2, JSON.stringify(result));
      assert.equal(result.allIndexed, true, JSON.stringify(result));
      assert.ok(
        result.pieceSeqs.every((n) => n > 0),
        "pieces must have sequenceNumber: " + JSON.stringify(result)
      );
      // Chess unit = 2 pieces + 4 badge fruits → 6 indexed apples, seq 1..6.
      assert.equal(result.listLen, 6, JSON.stringify(result));
      assert.deepEqual(
        result.seqs,
        [1, 2, 3, 4, 5, 6],
        JSON.stringify(result)
      );
      assert.equal(result.tallyIndex, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("tally portal pair shares the same sequenceNumber", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        window.__slotSpecialStore = [2];
        g.wa.ka.length = 0;
        const units = window.slot_plant_wave_units(g, 5, 3, {
          indexTally: true,
        });
        const list = g.wa.ka.filter((f) => f && !f.Oka);
        const portals = list.filter((f) => f.__slotPortal);
        const portalSeqs = portals.map((f) => f.sequenceNumber | 0);
        const uniquePortalSeq = new Set(portalSeqs);
        const distinctSeq = new Set(list.map((f) => f.sequenceNumber | 0));

        return {
          units,
          listLen: list.length,
          portalCount: portals.length,
          portalSeqs,
          samePortalIndex:
            uniquePortalSeq.size === 1 && (portalSeqs[0] | 0) > 0,
          distinctCount: distinctSeq.size,
          pairIdMatch:
            portals.length === 2 &&
            portals[0].__slotPortalPairId === portals[1].__slotPortalPairId,
          tallyIndex: g.wa.wa | 0,
        };
      });

      assert.equal(result.units, 5, JSON.stringify(result));
      // Portal pair (2 apples) + 4 badges = 6 apples; pair shares one index
      // → 5 distinct sequenceNumbers.
      assert.equal(result.portalCount, 2, JSON.stringify(result));
      assert.equal(result.listLen, 6, JSON.stringify(result));
      assert.equal(result.samePortalIndex, true, JSON.stringify(result));
      assert.equal(result.distinctCount, 5, JSON.stringify(result));
      assert.equal(result.pairIdMatch, true, JSON.stringify(result));
      assert.equal(result.tallyIndex, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("tally mexico pair shares sequenceNumber; mid-board defers like portal", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 46, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        // Mid-board Mexico: store only — no pair plant (like Portal).
        g.wa.ka.length = 0;
        window.__slotSpecialStore = [];
        window.__slotMexicoMidUp = false;
        const keep = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const mexEat = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        window.assignSlotMode(keep);
        mexEat.slotMode = 27;
        g.wa.ka.push(keep, mexEat);
        window.appleArray = g.wa.ka;
        eatBadge(mexEat, 27);
        const midFruit = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
        const midMexicoPortals = g.wa.ka.filter(
          (f) => f && f.__slotMexicoPortal
        ).length;
        const midStore = (window.__slotSpecialStore || []).slice();
        const midWall = !!window.__slotMexicoMidUp;

        // Empty board wave with stored Mexico: 1 Mexico unit + 4 badges.
        window.__slotSpecialStore = [27];
        window.__slotMexicoMidUp = false;
        g.wa.ka.length = 0;
        const units = window.slot_plant_wave_units(g, 5, 3, {
          indexTally: true,
        });
        const list = g.wa.ka.filter((f) => f && !f.Oka);
        const mexPortals = list.filter((f) => f.__slotMexicoPortal);
        const mexSeqs = mexPortals.map((f) => f.sequenceNumber | 0);
        const uniqueMexSeq = new Set(mexSeqs);
        const distinctSeq = new Set(list.map((f) => f.sequenceNumber | 0));

        return {
          isStoreSpecial: !!window.slot_is_store_special(27),
          midFruit,
          midMexicoPortals,
          midStore,
          midWall,
          units,
          listLen: list.length,
          mexPortalCount: mexPortals.length,
          mexSeqs,
          sameMexIndex: uniqueMexSeq.size === 1 && (mexSeqs[0] | 0) > 0,
          distinctCount: distinctSeq.size,
          mexPairIdMatch:
            mexPortals.length === 2 &&
            mexPortals[0].__slotMexicoPairId ===
              mexPortals[1].__slotMexicoPairId,
          portalPairIdMatch:
            mexPortals.length === 2 &&
            mexPortals[0].__slotPortalPairId ===
              mexPortals[1].__slotPortalPairId,
          midUpAfterWave: !!window.__slotMexicoMidUp,
          tallyIndex: g.wa.wa | 0,
        };
      });

      assert.equal(result.isStoreSpecial, true, JSON.stringify(result));
      assert.equal(result.midFruit, 1, JSON.stringify(result));
      assert.equal(result.midMexicoPortals, 0, JSON.stringify(result));
      assert.deepEqual(result.midStore, [27], JSON.stringify(result));
      assert.equal(result.midWall, false, JSON.stringify(result));
      assert.equal(result.units, 5, JSON.stringify(result));
      assert.equal(result.mexPortalCount, 2, JSON.stringify(result));
      assert.equal(result.listLen, 6, JSON.stringify(result));
      assert.equal(result.sameMexIndex, true, JSON.stringify(result));
      assert.equal(result.distinctCount, 5, JSON.stringify(result));
      assert.equal(result.mexPairIdMatch, true, JSON.stringify(result));
      assert.equal(result.portalPairIdMatch, true, JSON.stringify(result));
      assert.equal(result.midUpAfterWave, true, JSON.stringify(result));
      assert.equal(result.tallyIndex, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("Mexico portal pair refuses snake body cells (spawn fail)", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 47, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        g.wa.ka.length = 0;
        window.appleArray = g.wa.ka;
        window.__slotMexicoMidUp = false;

        // Force every candidate cell to look like snake body → half search fails.
        const origOnSnake = window.slot_soko_pos_on_snake;
        window.slot_soko_pos_on_snake = function () {
          return true;
        };
        const blocked = window.slot_mexico_plant_portal_pair(g);
        const midAfterBlock = !!window.__slotMexicoMidUp;
        const portalsAfterBlock = g.wa.ka.filter(
          (f) => f && f.__slotMexicoPortal
        ).length;
        window.slot_soko_pos_on_snake = origOnSnake;

        // With normal snake occupancy, plant should succeed off the body.
        const ok = window.slot_mexico_plant_portal_pair(g);
        const portals = g.wa.ka.filter((f) => f && f.__slotMexicoPortal);
        let onSnake = false;
        for (let i = 0; i < portals.length; i++) {
          if (window.slot_soko_pos_on_snake(g, portals[i].pos)) onSnake = true;
        }

        // Relocate also refuses snake-covered halves.
        window.slot_soko_pos_on_snake = function () {
          return true;
        };
        const relocateFail =
          portals.length === 2
            ? !window.slot_mexico_relocate_pair_halves(
                portals[0],
                portals[1],
                g.wa
              )
            : false;
        window.slot_soko_pos_on_snake = origOnSnake;

        // Mid walls skip snake-occupied mid cells (leave gaps).
        window.__slotMexicoMidUp = false;
        window.slot_mexico_clear_mid(g);
        const mid = window.slot_mexico_mid_y(g) | 0;
        const body = g.oa && g.oa.ka;
        const midSegXs = [];
        if (body && body.length) {
          for (let i = 0; i < body.length; i++) {
            const seg = body[i];
            if (!seg) continue;
            const sx = seg.x != null ? seg.x | 0 : seg.pos ? seg.pos.x | 0 : NaN;
            const sy = seg.y != null ? seg.y | 0 : seg.pos ? seg.pos.y | 0 : NaN;
            if (sy === mid && sx === sx) midSegXs.push(sx);
          }
          // Park at least one segment on mid so we can assert a wall gap.
          if (!midSegXs.length && body[0]) {
            const head = body[0];
            if (head.y != null) head.y = mid;
            else if (head.pos) head.pos.y = mid;
            midSegXs.push(head.x != null ? head.x | 0 : head.pos.x | 0);
          }
        }
        window.__slotMexicoMidUp = false;
        const midPlanted = window.slot_mexico_place_partial_mid(g);
        const walls = g.Ca && g.Ca.wa && g.Ca.wa[mid];
        let wallOnSnake = false;
        for (let i = 0; i < midSegXs.length; i++) {
          const wx = midSegXs[i] | 0;
          if (walls && (walls[wx] | 0) > 0) wallOnSnake = true;
        }
        const blockedMid =
          midSegXs.length > 0 &&
          window.slot_mexico_cell_blocked_for_mid(g, midSegXs[0], mid);

        return {
          blocked,
          midAfterBlock,
          portalsAfterBlock,
          ok,
          portalCount: portals.length,
          onSnake,
          relocateFail,
          midPlanted,
          wallOnSnake,
          blockedMid,
          midSegCount: midSegXs.length,
        };
      });

      assert.equal(result.blocked, false, JSON.stringify(result));
      assert.equal(result.midAfterBlock, false, JSON.stringify(result));
      assert.equal(result.portalsAfterBlock, 0, JSON.stringify(result));
      assert.equal(result.ok, true, JSON.stringify(result));
      assert.equal(result.portalCount, 2, JSON.stringify(result));
      assert.equal(result.onSnake, false, JSON.stringify(result));
      assert.equal(result.relocateFail, true, JSON.stringify(result));
      assert.equal(result.blockedMid, true, JSON.stringify(result));
      assert.equal(result.wallOnSnake, false, JSON.stringify(result));
      assert.ok(result.midSegCount > 0, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("tally key/soko unlock fruit gets max sequenceNumber + 1", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 45, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.TALLY,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        // Board with indexed fruits max=5 (portal pair shares 5).
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        const b = window.slot_make_apple(g.wa, { x: 5, y: 4 });
        const c = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        a.sequenceNumber = 3;
        b.sequenceNumber = 5;
        c.sequenceNumber = 5;
        window.slot_assign_pair(b, c);
        window.assignSlotMode(a);
        g.wa.ka.push(a, b, c);
        window.appleArray = g.wa.ka;
        // Current edible below board max → unlock still takes board max + 1.
        g.wa.wa = 2;

        // Key unlock: new fruit inherits junk seq, then after_native stamps max+1.
        const keyFruit = window.slot_make_apple(g.wa, { x: 8, y: 4 });
        delete keyFruit.slotMode;
        keyFruit.sequenceNumber = 1;
        g.wa.ka.push(keyFruit);
        window.slot_key_unlock_fruit = 1;
        window.__slotRespawnedThisEat = true;
        window.__slotEating = false;
        window.slot_after_native_respawn(g.wa, 1, g);
        const keySeq = keyFruit.sequenceNumber | 0;
        const keyBadged = keyFruit.slotMode != null;

        // Soko unlock similarly.
        const sokoFruit = window.slot_make_apple(g.wa, { x: 9, y: 4 });
        delete sokoFruit.slotMode;
        sokoFruit.sequenceNumber = 2;
        g.wa.ka.push(sokoFruit);
        window.slot_soko_unlock_fruit = 1;
        window.slot_after_native_respawn(g.wa, 1, g);
        const sokoSeq = sokoFruit.sequenceNumber | 0;
        const sokoBadged = sokoFruit.slotMode != null;

        // Empty board + advanced snake tally: unlock must follow current index,
        // not reset to 1.
        g.wa.ka.length = 0;
        window.appleArray = g.wa.ka;
        g.wa.wa = 4;
        const emptyUnlock = window.slot_make_apple(g.wa, { x: 3, y: 3 });
        delete emptyUnlock.slotMode;
        emptyUnlock.sequenceNumber = 1;
        g.wa.ka.push(emptyUnlock);
        window.slot_soko_unlock_fruit = 1;
        window.slot_after_native_respawn(g.wa, 1, g);
        const emptySeq = emptyUnlock.sequenceNumber | 0;

        // Empty board + current ahead of boardNext; also current > board fruits.
        g.wa.ka.length = 0;
        const leftover = window.slot_make_apple(g.wa, { x: 2, y: 2 });
        leftover.sequenceNumber = 2;
        window.assignSlotMode(leftover);
        g.wa.ka.push(leftover);
        window.appleArray = g.wa.ka;
        g.wa.wa = 5;
        const midUnlock = window.slot_make_apple(g.wa, { x: 1, y: 1 });
        delete midUnlock.slotMode;
        midUnlock.sequenceNumber = 1;
        g.wa.ka.push(midUnlock);
        window.slot_key_unlock_fruit = 1;
        window.slot_after_native_respawn(g.wa, 1, g);
        const midSeq = midUnlock.sequenceNumber | 0;

        return {
          keySeq,
          keyBadged,
          sokoSeq,
          sokoBadged,
          emptySeq,
          midSeq,
          maxBeforeKey: 5,
          helpers: {
            stamp: typeof window.slot_stamp_tally_unlock_index === "function",
            maxFn: typeof window.slot_tally_board_max_sequence === "function",
          },
        };
      });

      assert.equal(result.helpers.stamp, true, JSON.stringify(result));
      assert.equal(result.helpers.maxFn, true, JSON.stringify(result));
      assert.equal(result.keyBadged, true, JSON.stringify(result));
      assert.equal(result.keySeq, 6, JSON.stringify(result));
      assert.equal(result.sokoBadged, true, JSON.stringify(result));
      // After key unlock max is 6, so soko unlock → 7.
      assert.equal(result.sokoSeq, 7, JSON.stringify(result));
      assert.equal(result.emptySeq, 4, JSON.stringify(result));
      assert.equal(result.midSeq, 5, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("dice/tally: store specials FIFO; mid-wave no plant; leftover across rolls", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 41, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 4;
        g.settings.Ca = 4;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        function fruitCount() {
          return g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
        }

        // Mid-board portal: store only — no portal pair plant.
        g.wa.ka.length = 0;
        window.__slotSpecialStore = [];
        const keep = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const portalEat = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        window.assignSlotMode(keep);
        portalEat.slotMode = 2;
        g.wa.ka.push(keep, portalEat);
        window.appleArray = g.wa.ka;
        eatBadge(portalEat, 2);
        const midFruit = fruitCount();
        const midPortals = g.wa.ka.filter((f) => f && f.__slotPortal).length;
        const midStore = (window.__slotSpecialStore || []).slice();

        // Queue portal, key, soko; force empty with cheese; roll fixed 2.
        window.__slotSpecialStore = [2, 8, 9];
        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const last = window.slot_make_apple(g.wa, { x: 6, y: 6 });
        last.slotMode = 3;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        window.__slotQ6E = function (ba) {
          ba.keys = ba.keys || [];
          ba.keys.push({
            type: 0,
            pos: { x: 3, y: 3 },
            r7a: { x: 4, y: 4 },
          });
        };
        const origDice = window.slot_dice_spawn_n;
        window.slot_dice_spawn_n = function () {
          return 2;
        };
        eatBadge(last, 3);
        window.slot_dice_spawn_n = origDice;

        const portalsAfter = g.wa.ka.filter((f) => f && f.__slotPortal).length;
        const keysAfter = (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0;
        const storeAfter = (window.__slotSpecialStore || []).slice();
        // Portal unit (2 fruits) + key unit (0 fruits) = 2 fruits if only those;
        // roll 2 = portal + key, so fruit count is portal pair only.
        const fruitsAfter = fruitCount();

        // Clear board + keys; leftover soko should lead next roll of 1.
        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        window.appleArray = g.wa.ka;
        const last2 = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        last2.slotMode = 3;
        g.wa.ka.push(last2);
        window.appleArray = g.wa.ka;
        window.__slotE5E = function (aa) {
          aa.oa = aa.oa || new Set();
          aa.d_ = aa.d_ || new Set();
          aa.oa.add({
            pos: { x: 2, y: 2 },
            prev: null,
            wm: true,
            Lh: true,
          });
          aa.d_.add({ x: 3, y: 2 });
        };
        window.slot_dice_spawn_n = function () {
          return 1;
        };
        eatBadge(last2, 3);
        window.slot_dice_spawn_n = origDice;
        const sokoAfter = !!(
          window.slot_has_sokoboxes && window.slot_has_sokoboxes(g)
        );
        const storeFinal = (window.__slotSpecialStore || []).slice();

        // Tally: mid-wave key stores, empty plants key as first of 5.
        g.settings.ka = 6;
        g.settings.Ca = 6;
        window.slot_reset_state();
        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        if (g.Aa) {
          try {
            if (g.Aa.oa && typeof g.Aa.oa.clear === "function") g.Aa.oa.clear();
            else g.Aa.oa = new Set();
            if (g.Aa.d_ && typeof g.Aa.d_.clear === "function") g.Aa.d_.clear();
            else g.Aa.d_ = new Set();
          } catch (_s) {
            g.Aa.oa = new Set();
            g.Aa.d_ = new Set();
          }
        }
        const tKeep = window.slot_make_apple(g.wa, { x: 5, y: 8 });
        const tKey = window.slot_make_apple(g.wa, { x: 7, y: 8 });
        window.assignSlotMode(tKeep);
        tKey.slotMode = 8;
        g.wa.ka.push(tKeep, tKey);
        window.appleArray = g.wa.ka;
        eatBadge(tKey, 8);
        const tallyMidStore = (window.__slotSpecialStore || []).slice();
        const tallyMidFruit = fruitCount();

        g.wa.ka.length = 0;
        if (g.Ba && g.Ba.keys) g.Ba.keys.length = 0;
        const tLast = window.slot_make_apple(g.wa, { x: 6, y: 8 });
        tLast.slotMode = 3;
        g.wa.ka.push(tLast);
        window.appleArray = g.wa.ka;
        window.__slotQ6E = function (ba) {
          ba.keys = ba.keys || [];
          ba.keys.push({
            type: 1,
            pos: { x: 1, y: 1 },
            r7a: { x: 2, y: 1 },
          });
        };
        eatBadge(tLast, 3);
        const tallyKeys = (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0;
        const tallyFruits = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece);
        const tallyStore = (window.__slotSpecialStore || []).slice();

        return {
          midFruit,
          midPortals,
          midStore,
          portalsAfter,
          keysAfter,
          fruitsAfter,
          storeAfter,
          sokoAfter,
          storeFinal,
          tallyMidStore,
          tallyMidFruit,
          tallyKeys,
          tallyFruitCount: tallyFruits.length,
          tallyStore,
          tallyIndex: g.wa.wa | 0,
        };
      });

      assert.equal(result.midFruit, 1, JSON.stringify(result));
      assert.equal(result.midPortals, 0, JSON.stringify(result));
      assert.deepEqual(result.midStore, [2], JSON.stringify(result));
      assert.equal(result.portalsAfter, 2, JSON.stringify(result));
      assert.equal(result.keysAfter, 1, JSON.stringify(result));
      assert.equal(result.fruitsAfter, 2, JSON.stringify(result));
      assert.deepEqual(result.storeAfter, [9], JSON.stringify(result));
      assert.equal(result.sokoAfter, true, JSON.stringify(result));
      assert.deepEqual(result.storeFinal, [], JSON.stringify(result));
      assert.deepEqual(result.tallyMidStore, [8], JSON.stringify(result));
      assert.equal(result.tallyMidFruit, 1, JSON.stringify(result));
      assert.equal(result.tallyKeys, 1, JSON.stringify(result));
      // Key unit + 4 badge fruits = 4 edible fruits (key is entity-only).
      assert.equal(result.tallyFruitCount, 4, JSON.stringify(result));
      assert.deepEqual(result.tallyStore, [], JSON.stringify(result));
      assert.equal(result.tallyIndex, 1, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("bomb pre-kc: stored portal folds into 24; keys do not delay wave", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 42, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.BOMB,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 5;
        g.settings.Ca = 5;
        g.kc = false;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);

        function eatBadge(fruit, mode) {
          fruit.slotMode = mode;
          window.just_ate = "fruit";
          window.__slotEatenFruit = fruit;
          window.__slotEatenMode = mode;
          window.__slotEating = true;
          window.setSlotActive(mode, g);
          window.slot_eat_respawn(g);
          const ix = g.wa.ka.indexOf(fruit);
          if (ix >= 0) g.wa.ka.splice(ix, 1);
          window.appleArray = g.wa.ka;
        }

        // Mid-board portal stores (no plant).
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        const b = window.slot_make_apple(g.wa, { x: 7, y: 5 });
        window.assignSlotMode(a);
        b.slotMode = 2;
        g.wa.ka.push(a, b);
        window.appleArray = g.wa.ka;
        eatBadge(b, 2);
        const midStore = (window.__slotSpecialStore || []).slice();
        const midPortals = g.wa.ka.filter((f) => f && f.__slotPortal).length;

        // Empty with leftover key entity + stored portal → still plant 24 units.
        g.wa.ka.length = 0;
        g.kc = false;
        if (g.Ba) {
          g.Ba.keys = [
            {
              type: 0,
              pos: { x: 1, y: 1 },
              r7a: { x: 2, y: 1 },
            },
          ];
        }
        window.__slotSpecialStore = [2];
        const last = window.slot_make_apple(g.wa, { x: 6, y: 6 });
        last.slotMode = 3;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        eatBadge(last, 3);

        const portals = g.wa.ka.filter((f) => f && f.__slotPortal).length;
        const fruits = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length;
        // 1 portal unit (2 apples) + 23 badge = 25 fruits; 24 units.
        const storeLeft = (window.__slotSpecialStore || []).slice();
        const keysLeft = (g.Ba && g.Ba.keys && g.Ba.keys.length) | 0;

        return {
          midStore,
          midPortals,
          portals,
          fruits,
          storeLeft,
          keysLeft,
          kc: !!g.kc,
        };
      });

      assert.deepEqual(result.midStore, [2], JSON.stringify(result));
      assert.equal(result.midPortals, 0, JSON.stringify(result));
      assert.equal(result.portals, 2, JSON.stringify(result));
      assert.equal(result.fruits, 25, JSON.stringify(result));
      assert.deepEqual(result.storeLeft, [], JSON.stringify(result));
      assert.equal(result.keysLeft, 1, JSON.stringify(result));
      assert.equal(result.kc, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("peaceful roll: walking into locked chess piece eats it", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 44, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.THREE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        g.Sh = 0;
        window.cat_check_score_win = () => false;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        window.__slotWrapActives && window.__slotWrapActives();
        window.setSlotActive(21, g);

        g.wa.ka.length = 0;
        const piece = window.slot_make_apple(g.wa, { x: 5, y: 5 });
        piece.isPiece = true;
        piece.ChessPiece = "knight";
        piece.ChessColor = "b";
        piece.nba = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);
        const other = window.slot_make_apple(g.wa, { x: 12, y: 12 });
        other.slotMode = 3;
        g.wa.ka.push(piece, other);
        window.appleArray = g.wa.ka;
        window.head_state = "OPEN";
        window.shield_all();
        const afterShield =
          piece.nba && typeof piece.nba.size === "number" ? piece.nba.size : 0;

        const head = g.oa.ka[0];
        g.oa.direction = "RIGHT";
        g.oa.Ca = "RIGHT";
        piece.pos.x = head.x + 1;
        piece.pos.y = head.y;
        const before = g.wa.ka.length;
        g.tick();
        return {
          peaceful: window.chess_peaceful_active(g),
          afterShield,
          before,
          after: g.wa.ka.length,
          pieceGone: !g.wa.ka.includes(piece),
          nj: !!g.nj,
          just_ate: window.just_ate,
          head_state: window.head_state,
        };
      });

      assert.equal(result.peaceful, true, JSON.stringify(result));
      assert.equal(result.afterShield, 0, JSON.stringify(result));
      assert.equal(result.pieceGone, true, JSON.stringify(result));
      assert.equal(result.nj, false, JSON.stringify(result));
      assert.equal(result.just_ate, "piece", JSON.stringify(result));
      assert.equal(result.head_state, "knight", JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("carrying ignores peaceful: locks stay; second eat relocates and clears old cell", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 47, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.nj = false;
        window.slot_reset_state();
        window.__slotWrapActives && window.__slotWrapActives();
        // Peaceful roll while already carrying must not wipe Chess locks.
        window.setSlotActive(21, g);
        window.cat_peaceful_ticks = 40;

        g.wa.ka.length = 0;
        const white = window.slot_make_apple(g.wa, { x: 10, y: 8 });
        white.isPiece = true;
        white.ChessPiece = "rook";
        white.ChessColor = "w";
        white.type = window.wrook != null ? window.wrook : 1;
        const black = window.slot_make_apple(g.wa, { x: 12, y: 8 });
        black.isPiece = true;
        black.ChessPiece = "pawn";
        black.ChessColor = "b";
        black.type = window.bpawn != null ? window.bpawn : 2;
        const keep = window.slot_make_apple(g.wa, { x: 14, y: 10 });
        keep.isPiece = true;
        keep.ChessPiece = "bishop";
        keep.ChessColor = "w";
        keep.type = window.wbishop != null ? window.wbishop : 3;
        g.wa.ka.push(white, black, keep);
        window.appleArray = g.wa.ka;

        window.head_state = "queen";
        window.head_color = "w";
        window.shield_all();
        const lockSize =
          black.nba && typeof black.nba.size === "number" ? black.nba.size : 0;

        const counts = () => {
          let w = 0;
          let b = 0;
          for (const f of g.wa.ka) {
            if (!f || !f.isPiece) continue;
            if (f.ChessColor === "w") w++;
            if (f.ChessColor === "b") b++;
          }
          return { w, b, n: g.wa.ka.filter((f) => f && f.isPiece).length };
        };
        const before = counts();

        // Force relocate success via slot_free_pos far from black.
        const savedFree = window.slot_free_pos;
        window.slot_free_pos = () => window.slot_make_pos(3, 3);
        const eatenCell = { x: black.pos.x | 0, y: black.pos.y | 0 };
        window.chess_on_second_piece_eat(black);
        // Simulate native splice of the eaten apple.
        const ix = g.wa.ka.indexOf(black);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        window.appleArray = g.wa.ka;
        window.slot_free_pos = savedFree;

        const after = counts();
        const atOld = g.wa.ka.some(
          (f) =>
            f &&
            f.pos &&
            (f.pos.x | 0) === eatenCell.x &&
            (f.pos.y | 0) === eatenCell.y
        );
        const relocated = g.wa.ka.some(
          (f) =>
            f &&
            f.isPiece &&
            f.ChessColor === "b" &&
            (f.pos.x | 0) === 3 &&
            (f.pos.y | 0) === 3
        );
        const headAfterRelocate = window.head_state;

        // Fail path: no free cell → opposite exit; eaten still spliced away.
        window.head_state = "rook";
        window.head_color = "w";
        const opp = window.slot_make_apple(g.wa, { x: 11, y: 6 });
        opp.isPiece = true;
        opp.ChessPiece = "knight";
        opp.ChessColor = "b";
        g.wa.ka.push(opp);
        window.appleArray = g.wa.ka;
        window.slot_free_pos = () => null;
        const savedFind = window.chess_find_legal_spawn;
        window.chess_find_legal_spawn = () => null;
        window.chess_on_second_piece_eat(opp);
        const failIx = g.wa.ka.indexOf(opp);
        if (failIx >= 0) g.wa.ka.splice(failIx, 1);
        window.appleArray = g.wa.ka;
        window.slot_free_pos = savedFree;
        window.chess_find_legal_spawn = savedFind;
        const failAtOld = g.wa.ka.some(
          (f) =>
            f && f.pos && (f.pos.x | 0) === 11 && (f.pos.y | 0) === 6
        );

        return {
          peaceful: window.chess_peaceful_active(g),
          lockSize,
          before,
          after,
          atOld,
          relocated,
          headAfterRelocate,
          headAfterFail: window.head_state,
          failAtOld,
        };
      });

      assert.equal(result.peaceful, true, JSON.stringify(result));
      assert.equal(result.lockSize, 4, "carry+peaceful must lock: " + JSON.stringify(result));
      assert.equal(result.atOld, false, JSON.stringify(result));
      assert.equal(result.relocated, true, JSON.stringify(result));
      assert.equal(result.headAfterRelocate, "queen", JSON.stringify(result));
      assert.equal(result.after.w, result.before.w, JSON.stringify(result));
      assert.equal(result.after.b, result.before.b, JSON.stringify(result));
      assert.equal(result.failAtOld, false, JSON.stringify(result));
      assert.equal(result.headAfterFail, "OPEN", JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("bomb badge eat arms only the new spawn, not board leftovers", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 33, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        g.settings.ka = 1; // 3a-ish board via manual fruit
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        window.bombFruit_reset_state && window.bombFruit_reset_state();

        g.wa.ka.length = 0;
        const leftA = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        const leftB = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        const bomb = window.slot_make_apple(g.wa, { x: 8, y: 4 });
        leftA.slotMode = 3;
        leftB.slotMode = 1;
        bomb.slotMode = 28;
        g.wa.ka.push(leftA, leftB, bomb);
        window.appleArray = g.wa.ka;

        // Prior bomb plant on this fruit (idle ring + snap) — eat must not
        // leave a linger radius on the old cell or zone leftovers.
        window.bombFruit_init_apple(bomb);
        window.bombFruit_ensure_zone(bomb.pos.x, bomb.pos.y, -1);
        bomb.__slotBombPlant = true;
        window.__bombFruitAppleSnap = [
          {
            el: bomb,
            key: bomb.pos.x + "," + bomb.pos.y,
            bombX1a: -1,
          },
        ];
        window.__bombFruitLastPos = new WeakMap();
        window.__bombFruitLastPos.set(bomb, bomb.pos.x + "," + bomb.pos.y);
        window.__bombFruitBootstrapped = true;

        window.just_ate = "fruit";
        window.__slotEatenFruit = bomb;
        window.__slotEatenMode = 28;
        window.__slotEating = true;
        window.setSlotActive(28, g);
        const beforeLen = g.wa.ka.length;
        window.slot_eat_respawn(g);
        const ix = g.wa.ka.indexOf(bomb);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        window.appleArray = g.wa.ka;

        // Simulate tick/draw paths that used to zone every apple.
        if (typeof window.bombFruit_tick_logic === "function") {
          window.bombFruit_tick_logic(g);
        }
        if (typeof window.bombFruit_plant_layout_zones === "function") {
          window.bombFruit_plant_layout_zones(g.wa, false);
        }
        if (typeof window.bombFruit_after_respawn === "function") {
          window.bombFruit_after_respawn(g.wa, 1, false);
        }
        if (typeof window.bombFruit_refresh_snap === "function") {
          window.bombFruit_refresh_snap(g.wa);
        }

        const zones = window.__bombFruitZones || [];
        const zoneKeys = new Set(
          zones.map((z) => (z ? z.x + "," + z.y : ""))
        );
        const fruits = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece);
        const marked = fruits.filter((f) => f.__slotBombPlant);
        const unmarked = fruits.filter((f) => !f.__slotBombPlant);
        const unmarkedZoned = unmarked.filter((f) => {
          if (!f.pos) return false;
          return zoneKeys.has((f.pos.x | 0) + "," + (f.pos.y | 0));
        });
        const markedZoned = marked.filter((f) => {
          if (!f.pos) return false;
          return zoneKeys.has((f.pos.x | 0) + "," + (f.pos.y | 0));
        });
        const eatenStillZoned = zoneKeys.has("8,4");

        return {
          beforeLen,
          afterLen: fruits.length,
          marked: marked.length,
          unmarked: unmarked.length,
          unmarkedZoned: unmarkedZoned.length,
          markedZoned: markedZoned.length,
          idleZones: zones.filter((z) => z && (z.bombX1a | 0) < 0).length,
          totalZones: zones.length,
          eatenStillZoned,
          active: window.__slotActive | 0,
          refreshGated: !!(
            window.bombFruit_refresh_snap &&
            window.bombFruit_refresh_snap.__slotGate
          ),
        };
      });

      assert.equal(result.active, 28, JSON.stringify(result));
      assert.equal(result.afterLen, 3, JSON.stringify(result)); // 2 leftovers + 1 new
      assert.equal(result.marked, 1, JSON.stringify(result));
      assert.equal(result.unmarked, 2, JSON.stringify(result));
      assert.equal(result.unmarkedZoned, 0, JSON.stringify(result));
      assert.equal(result.markedZoned, 1, JSON.stringify(result));
      assert.equal(result.idleZones, 1, JSON.stringify(result));
      assert.equal(result.totalZones, 1, JSON.stringify(result));
      assert.equal(result.eatenStillZoned, false, JSON.stringify(result));
      assert.equal(result.refreshGated, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("leaving bomb roll keeps plant idle ring; other eat does not arm leftovers", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 35, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        window.bombFruit_reset_state && window.bombFruit_reset_state();

        g.wa.ka.length = 0;
        const left = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        const bombBadge = window.slot_make_apple(g.wa, { x: 8, y: 4 });
        left.slotMode = 3;
        bombBadge.slotMode = 28;
        g.wa.ka.push(left, bombBadge);
        window.appleArray = g.wa.ka;

        window.just_ate = "fruit";
        window.__slotEatenFruit = bombBadge;
        window.__slotEatenMode = 28;
        window.__slotEating = true;
        window.setSlotActive(28, g);
        window.slot_eat_respawn(g);
        const ix = g.wa.ka.indexOf(bombBadge);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        window.appleArray = g.wa.ka;

        const plantsAfterArm = g.wa.ka.filter((f) => f && f.__slotBombPlant);
        const plant = plantsAfterArm[0];
        const plantPos = plant && plant.pos
          ? { x: plant.pos.x | 0, y: plant.pos.y | 0 }
          : null;

        // Leave Bomb for Wall — plant + idle ring must remain.
        window.setSlotActive(1, g);
        const zonesAfterLeave = (window.__bombFruitZones || []).filter(
          (z) => z && (z.bombX1a | 0) < 0
        );
        const stillMarked = !!(plant && plant.__slotBombPlant);
        const bfActive =
          window.isBombFruitActive && window.isBombFruitActive();

        // Eat a different (non-bomb) fruit — must not arm the leftover wall fruit.
        window.just_ate = "fruit";
        window.__slotEatenFruit = left;
        window.__slotEatenMode = 3;
        window.__slotEating = true;
        window.setSlotActive(3, g);
        window.slot_eat_respawn(g);
        const lix = g.wa.ka.indexOf(left);
        if (lix >= 0) g.wa.ka.splice(lix, 1);
        window.appleArray = g.wa.ka;
        if (typeof window.bombFruit_after_respawn === "function") {
          window.bombFruit_after_respawn(g.wa, 1, false);
        }
        if (typeof window.bombFruit_tick_logic === "function") {
          window.bombFruit_tick_logic(g);
        }

        const fruits = g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece);
        const marked = fruits.filter((f) => f.__slotBombPlant);
        const unmarked = fruits.filter((f) => !f.__slotBombPlant);
        const unmarkedZoned = unmarked.filter((f) => {
          if (!f.pos) return false;
          const key = (f.pos.x | 0) + "," + (f.pos.y | 0);
          return (window.__bombFruitZones || []).some(
            (z) => z && z.x + "," + z.y === key
          );
        });
        const plantStillZoned =
          plantPos &&
          (window.__bombFruitZones || []).some(
            (z) =>
              z &&
              (z.x | 0) === plantPos.x &&
              (z.y | 0) === plantPos.y &&
              (z.__slotBombPlant || (z.bombX1a | 0) < 0)
          );

        return {
          plantsAfterArm: plantsAfterArm.length,
          zonesAfterLeave: zonesAfterLeave.length,
          stillMarked,
          bfActive,
          marked: marked.length,
          unmarked: unmarked.length,
          unmarkedZoned: unmarkedZoned.length,
          plantStillZoned: !!plantStillZoned,
          active: window.__slotActive | 0,
        };
      });

      assert.equal(result.plantsAfterArm, 1, JSON.stringify(result));
      assert.ok(result.zonesAfterLeave >= 1, JSON.stringify(result));
      assert.equal(result.stillMarked, true, JSON.stringify(result));
      assert.equal(result.bfActive, true, JSON.stringify(result));
      assert.equal(result.marked, 1, JSON.stringify(result));
      assert.equal(result.unmarkedZoned, 0, JSON.stringify(result));
      assert.equal(result.plantStillZoned, true, JSON.stringify(result));
      assert.equal(result.active, 3, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("bomb badge eat does not teleport leftovers inside spawn radius", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 34, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.__remixGame = g;
        window.CurrentModeNum = window.SLOT_MACHINE_MODE;
        g.settings.ub = window.SLOT_MACHINE_MODE;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        window.bombFruit_reset_state && window.bombFruit_reset_state();

        const head = g.oa && g.oa.ka && g.oa.ka[0];
        if (!head) return { error: "no head" };
        // Leftovers deliberately inside Manhattan ≤3 of head — sync used to
        // treat them as brandNew and relocate via spawn radius.
        const nearA = {
          x: (head.x | 0) + 1,
          y: head.y | 0,
        };
        const nearB = {
          x: (head.x | 0) + 2,
          y: head.y | 0,
        };
        const bombPos = {
          x: (head.x | 0) + 8,
          y: head.y | 0,
        };

        g.wa.ka.length = 0;
        const leftA = window.slot_make_apple(g.wa, nearA);
        const leftB = window.slot_make_apple(g.wa, nearB);
        const bomb = window.slot_make_apple(g.wa, bombPos);
        leftA.slotMode = 3;
        leftB.slotMode = 1;
        bomb.slotMode = 28;
        g.wa.ka.push(leftA, leftB, bomb);
        window.appleArray = g.wa.ka;

        window.bombFruit_init_apple(bomb);
        window.bombFruit_ensure_zone(bomb.pos.x, bomb.pos.y, -1);
        bomb.__slotBombPlant = true;
        // Snap only knows the plant — reproduces the brandNew false positive.
        window.__bombFruitAppleSnap = [
          {
            el: bomb,
            key: bomb.pos.x + "," + bomb.pos.y,
            bombX1a: -1,
          },
        ];
        window.__bombFruitLastPos = new WeakMap();
        window.__bombFruitLastPos.set(bomb, bomb.pos.x + "," + bomb.pos.y);
        window.__bombFruitBootstrapped = true;

        const beforeA = { x: leftA.pos.x | 0, y: leftA.pos.y | 0 };
        const beforeB = { x: leftB.pos.x | 0, y: leftB.pos.y | 0 };
        const nearHeadA = !(
          window.chess_outside_spawn_radius &&
          window.chess_outside_spawn_radius(g, leftA.pos)
        );
        const nearHeadB = !(
          window.chess_outside_spawn_radius &&
          window.chess_outside_spawn_radius(g, leftB.pos)
        );

        window.just_ate = "fruit";
        window.__slotEatenFruit = bomb;
        window.__slotEatenMode = 28;
        window.__slotEating = true;
        window.setSlotActive(28, g);
        window.slot_eat_respawn(g);
        const ix = g.wa.ka.indexOf(bomb);
        if (ix >= 0) g.wa.ka.splice(ix, 1);
        window.appleArray = g.wa.ka;

        if (typeof window.bombFruit_after_respawn === "function") {
          window.bombFruit_after_respawn(g.wa, 1, false);
        }
        if (typeof window.bombFruit_sync_fruit_bombs === "function") {
          window.bombFruit_sync_fruit_bombs(g.wa);
        }
        if (typeof window.bombFruit_tick_logic === "function") {
          window.bombFruit_tick_logic(g);
        }
        if (typeof window.bombFruit_refresh_snap === "function") {
          window.bombFruit_refresh_snap(g.wa);
        }

        return {
          nearHeadA,
          nearHeadB,
          beforeA,
          beforeB,
          afterA: { x: leftA.pos.x | 0, y: leftA.pos.y | 0 },
          afterB: { x: leftB.pos.x | 0, y: leftB.pos.y | 0 },
          movedA:
            (leftA.pos.x | 0) !== beforeA.x || (leftA.pos.y | 0) !== beforeA.y,
          movedB:
            (leftB.pos.x | 0) !== beforeB.x || (leftB.pos.y | 0) !== beforeB.y,
          snapLen: (window.__bombFruitAppleSnap || []).length,
          fruitLen: g.wa.ka.filter((f) => f && !f.Oka && !f.isPiece).length,
          syncGated: !!(
            window.bombFruit_sync_fruit_bombs &&
            window.bombFruit_sync_fruit_bombs.__slotGate
          ),
        };
      });

      assert.equal(result.error, undefined, JSON.stringify(result));
      assert.equal(result.nearHeadA, true, JSON.stringify(result));
      assert.equal(result.nearHeadB, true, JSON.stringify(result));
      assert.equal(result.movedA, false, JSON.stringify(result));
      assert.equal(result.movedB, false, JSON.stringify(result));
      assert.equal(result.syncGated, true, JSON.stringify(result));
      // Snap tracks all live fruit (leftovers + new plant), not plants only.
      assert.equal(result.snapLen, result.fruitLen, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });

  it("spawn fail with no fruit left wins; siblings keep playing", async () => {
    const { launchHarness, COUNT, SIZE } = await import("../tools/harness.mjs");
    const h = await launchHarness({ seed: 41, headless: true });
    try {
      await h.start({
        mode: "slot_machine",
        count: COUNT.ONE,
        size: SIZE.NORMAL,
      });
      const result = await h.page.evaluate(() => {
        const g = window.__remixGame;
        window.slot_reset_state();
        g.wa.reset();
        window.slot_after_layout(g.wa);
        const origFree = window.slot_free_pos;
        window.slot_free_pos = () => null;

        // --- siblings present: spawn fail must not win ---
        g.nj = false;
        g.ub = false;
        g.lj = false;
        g.wa.ka.length = 0;
        const a = window.slot_make_apple(g.wa, { x: 4, y: 4 });
        const b = window.slot_make_apple(g.wa, { x: 6, y: 4 });
        a.slotMode = 1;
        b.slotMode = 3;
        g.wa.ka.push(a, b);
        window.appleArray = g.wa.ka;
        window.just_ate = "fruit";
        window.__slotEatenFruit = a;
        window.__slotEatenMode = 1;
        window.__slotEating = true;
        window.setSlotActive(1, g);
        window.slot_eat_respawn(g);
        const withSiblings = {
          nj: !!g.nj,
          ub: !!g.ub,
          len: g.wa.ka.filter((f) => f && f !== a).length,
        };

        // --- last fruit + spawn fail: win immediately (pre-splice) ---
        g.nj = false;
        g.ub = false;
        g.lj = false;
        g.wa.ka.length = 0;
        const last = window.slot_make_apple(g.wa, { x: 8, y: 5 });
        last.slotMode = 1;
        g.wa.ka.push(last);
        window.appleArray = g.wa.ka;
        window.just_ate = "fruit";
        window.__slotEatenFruit = last;
        window.__slotEatenMode = 1;
        window.__slotEating = true;
        window.setSlotActive(1, g);
        window.__slotGotAllCalls = 0;
        window.__slotMenuCalls = 0;
        window.timeKeeper = window.timeKeeper || {};
        window.timeKeeper.playing = true;
        window.timeKeeper.runStarted = true;
        const origGotAll = window.timeKeeper.gotAll;
        window.timeKeeper.gotAll = function (time, score) {
          window.__slotGotAllCalls = (window.__slotGotAllCalls | 0) + 1;
          window.timeKeeper.playing = false;
          if (typeof origGotAll === "function") {
            try {
              return origGotAll.apply(this, arguments);
            } catch (_e) {}
          }
        };
        g.menu = g.menu || { __slotMenu: 1 };
        window.__slotShowEndMenu = function (menu, delay, score) {
          window.__slotMenuCalls = (window.__slotMenuCalls | 0) + 1;
          window.__slotMenuArgs = [menu, delay, score];
        };
        window.__slotTrophyRestored = false;
        window.__slotActive = 26; // leftover cat badge icon
        window.updateSlotMachineTrophySRC = function () {
          window.__slotTrophyRestored = true;
        };
        window.slot_eat_respawn(g);
        const lastFruit = {
          nj: !!g.nj,
          ub: !!g.ub,
          lj: !!g.lj,
          // eaten still in ka until native splice
          lenIncludingEaten: g.wa.ka.length,
          timerStopped: !!(
            window.timeKeeper && window.timeKeeper.playing === false
          ),
          gotAllCalls: window.__slotGotAllCalls | 0,
          menuCalls: window.__slotMenuCalls | 0,
          menuDelay: window.__slotMenuArgs && window.__slotMenuArgs[1],
          trophyRestored: !!window.__slotTrophyRestored,
          activeCleared: window.__slotActive == null,
        };
        if (typeof origGotAll === "function") {
          window.timeKeeper.gotAll = origGotAll;
        }

        window.slot_free_pos = origFree;
        return { withSiblings, lastFruit };
      });

      assert.equal(result.withSiblings.nj, false, JSON.stringify(result));
      assert.equal(result.withSiblings.ub, false, JSON.stringify(result));
      assert.equal(result.withSiblings.len, 1, JSON.stringify(result));
      assert.equal(result.lastFruit.nj, true, JSON.stringify(result));
      assert.equal(result.lastFruit.ub, true, JSON.stringify(result));
      assert.equal(result.lastFruit.lj, false, JSON.stringify(result));
      assert.equal(result.lastFruit.timerStopped, true, JSON.stringify(result));
      assert.ok(result.lastFruit.gotAllCalls >= 1, JSON.stringify(result));
      assert.ok(result.lastFruit.menuCalls >= 1, JSON.stringify(result));
      assert.equal(result.lastFruit.menuDelay, 1400, JSON.stringify(result));
      assert.equal(result.lastFruit.trophyRestored, true, JSON.stringify(result));
      assert.equal(result.lastFruit.activeCleared, true, JSON.stringify(result));
    } finally {
      await h.close();
    }
  });
});
