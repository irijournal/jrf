import re, glob
CAP = {
 'd_0_1_two_histories': "The central tension of the book: two histories of Sita's retellings, and the constant beneath both.",
 'd_0_2_three_errors': "Three errors of the liberation narrative.",
 'd_0_3_evidence_levels': "Four levels of evidence and the job each does.",
 'd_1_0_speech': "A speaking Sita: six moments of speech and refusal in Vālmīki.",
 'd_1_4_four_endings': "How the early tellings end Sita's story.",
 'd_1_1_trial_procedure': "The scene before the fire, read as a trial.",
 'd_1_2_two_domains': "What depends on her and what does not: the distinction at the heart of Sita's defence.",
 'd_1_3_precedent': "The citizens' argument at 7.42.19, reconstructed.",
 'd_1_5_agni': "The politics of the agni-parīkṣā: the gendered distribution of proof and authority.",
 'd_2_0_genealogy': "The genealogy of Sita: traditions that run side by side.",
 'd_2_1_grammar': "Plurality within a grammar.",
 'd_2_2_line_cycle': "The bard's line and the women's round.",
 'd_2_3_choral': "Choral agency in the women's songs.",
 'd_2_4_shadow': "The shadow-Sita device.",
 'd_3_1_tribunal': "The colonial tribunal: one description, three valuations.",
 'd_3_2_redirected': "Refusal redirected: the nationalist Sita refuses outward, never inward.",
 'd_3_3_home_world': "The inner and outer domains of the nationalist resolution.",
 'd_4_1_interior': "Interiority is not voice.",
 'd_4_2_fire_shared': "Three solutions to the fire.",
 'd_5_1_borrowed': "The borrowed Sita of the anti-epic.",
 'd_5_2_reversal': "Reversing the heroes.",
 'd_5_3_two_victims': "The Uttarakāṇḍa's two victims.",
 'd_6_0_characters': "The women at the edges of Sita's story.",
 'd_6_1_accretions': "Three later accretions read back into 'tradition'.",
 'd_6_2_urmila': "Five Ūrmilās, five needs.",
 'd_7_1_devsen': "Nabaneeta Dev Sen's four ways women retell.",
 'd_7_2_teller_told': "Teller and told in Candrābatī.",
 'd_8_1_volga': "Liberation as an education.",
 'd_8_2_renunciant': "The renunciant's exit, from the Jain Sita to Volga.",
 'd_9_1_proof': "The hierarchy of proof and three answers to it.",
 'd_9_2_bargain': "The patriarchal bargain in the Rāmāyaṇa household.",
 'd_10_1_three_regimes': "Three regimes of the female body.",
 'd_10_2_rege': "Whose Sita is universalised?",
 'd_10_3_declared': "Declared and concealed programmes.",
 'd_11_1_narrator': "Interpretive power is not narrative power.",
 'd_11_2_round_trip': "The round trip of the export Sita.",
 'd_12_1_empowered_for': "Empowered for what?",
 'd_12_2_deferral': "Empowerment by deferral.",
 'd_13_1_washerman': "Three locations of the washerman.",
 'd_13_2_absence': "How absence is made to speak.",
 'd_14_1_deshaj': "Deśaj: the grammar of a native feminism.",
 'd_14_2_vocabulary': "The changing vocabulary of Sita.",
 'd_15_1_reception': "Reception as retelling.",
 'd_15_2_screen_refusal': "The refusal on screen.",
 'd_c_1_refusals': "Four forms of refusal.",
 'd_c_2_voice_need': "Voice against need.",
 'd_c_3_liberated_into': "Liberated from what, into what?",
}
REPLACE = {'fig_0_5_central_tension':'d_0_1_two_histories','fig_0_1_corpus_period':None,'fig_0_2_corpus_languages':None,'fig_0_3_corpus_women':None,
 'fig_0_4_retellings_timeline':None,'fig_1_3_endings_matrix':'d_1_4_four_endings','fig_1_1_valmiki_speech':'d_1_0_speech','fig_1_2_agni_pariksha':'d_1_5_agni',
 'fig_2_1_genealogy':'d_2_0_genealogy','fig_2_3_shadow_sita':'d_2_4_shadow','fig_2_2_regional_map':None,'fig_2_4_devsen_cycle':'d_2_2_line_cycle',
 'fig_3_1_home_world':'d_3_3_home_world','fig_4_1_interior_turn':'d_4_1_interior','fig_5_2_reversal':'d_5_2_reversal','fig_5_3_contested_tellings':None,
 'fig_5_1_two_victims':'d_5_3_two_victims','fig_6_1_character_map':'d_6_0_characters','fig_6_3_ahalya':'d_6_1_accretions','fig_6_2_urmila_line':'d_6_2_urmila',
 'fig_7_1_devsen_typology':'d_7_1_devsen','fig_7_2_sitayan_titles':None,'fig_8_1_volga_structure':'d_8_1_volga','fig_9_1_joseph_voices':None,
 'fig_10_1_rege_layers':'d_10_2_rege','fig_10_2_surpanakha':None,'fig_11_2_first_person':None,'fig_11_1_narrative_voice':None,
 'fig_12_1_agency_matrix':'d_12_1_empowered_for','fig_13_1_missing_queen':'d_13_1_washerman','fig_14_1_vocabulary':'d_14_2_vocabulary',
 'fig_15_1_screen':'d_15_2_screen_refusal','fig_c_2_voice_need':'d_c_2_voice_need','fig_c_1_agency_spectrum':'d_c_1_refusals'}
INSERT = [  # (file, before-marker, diagram)
 ('01-intro-a.md','## Coloniality and the reading of Sita','d_0_2_three_errors'),
 ('01-intro-b.md','**Level I** consists','d_0_3_evidence_levels'),
 ('02-ch01-b.md','She then asks the question that destroys','d_1_2_two_domains'),
 ('02-ch01-b.md','## Book 7: the precedent','d_1_1_trial_procedure'),
 ('02-ch01-b.md',"## Sita's reply from the riverbank",'d_1_3_precedent'),
 ('03-ch02-a.md','## Kamban: love before the bow','d_2_1_grammar'),
 ('03-ch02-b.md','### Mithila: the bride','d_2_3_choral'),
 ('04-ch03-a.md',"## The reformer's Sita",'d_3_1_tribunal'),
 ('04-ch03-b.md','## Urmila remembered','d_3_2_redirected'),
 ('05-ch04-b.md','## The "after" as women','d_4_2_fire_shared'),
 ('06-ch05-a.md','## Chalam: the Sita who walks','d_5_1_borrowed'),
 ('08-ch07-a.md','### Two translations','d_7_2_teller_told'),
 ('09-ch08-b.md','## Rama, again','d_8_2_renunciant'),
 ('10-ch09-b.md','## Humour as critique','d_9_1_proof'),
 ('11-ch10-a.md','The three regimes are not equally visible','d_10_1_three_regimes'),
 ('11-ch10-b.md','## Hira Bansode','d_10_3_declared'),
 ('12-ch11-a.md','### The ending','d_11_1_narrator'),
 ('12-ch11-b.md','## The devotional twin','d_11_2_round_trip'),
 ('13-ch12-a.md','### The nationalist key','d_12_2_deferral'),
 ('14-ch13-b.md','## Disappearance as refusal','d_13_2_absence'),
 ('15-ch14.md','### Whose *deś*?','d_14_1_deshaj'),
 ('16-ch15.md','## The refusal in popular cinema','d_15_1_reception'),
 ('22-conclusion.md','## What the decolonial reading has shown','d_c_3_liberated_into'),
]
def img(d): return f"![{CAP[d]} (Conceptual diagram.)](../figures/{d}.png)\n\n"
for f in sorted(glob.glob('chapters/*.md')):
    s = open(f).read(); o = s
    def rep(m):
        name = m.group(2).split('/')[-1].rsplit('.',1)[0]
        if name in REPLACE:
            new = REPLACE[name]
            return '' if new is None else img(new).rstrip('\n')
        if name.startswith('fig_12_2_patriarchal_bargain'):
            return img('d_9_2_bargain').rstrip('\n') if '10-ch09' in f else ''
        return m.group(0)
    s = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', rep, s)
    for fn, marker, d in INSERT:
        if f.endswith(fn) and f"{d}.png" not in s:
            i = s.find(marker)
            if i < 0: print('MARKER NOT FOUND', fn, marker); continue
            s = s[:i] + img(d) + s[i:]
    # in-text figure references
    s = re.sub(r' ?\((?:see )?Figures? [0-9C]+\.[0-9]+\)', '', s)
    lines = s.split('\n')
    lines = [l if l.startswith('![') else re.sub(r'Figure [0-9C]+\.[0-9]+', 'the accompanying figure', l) for l in lines]
    s = '\n'.join(lines); s = re.sub(r'\n{3,}', '\n\n', s)
    if s != o: open(f, 'w').write(s)
print('done')
