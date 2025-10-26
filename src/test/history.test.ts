import * as assert from 'assert';
import path from 'path';
import fs from "fs/promises";
import { HistoryHandler } from '../core/history';
import { before } from 'mocha';

// please edit pathToYourDirectory when you want to test it.
const pathToYourDirectory = "/Users/kazuyakurihara/Documents/work/llm/LinuxReader"

suite('Extension History', () => {
    let originalJsonChoice = {} as any;
    let originalShowHistory = "";
    before(async () => {
        const stubFilePath = path.resolve(pathToYourDirectory, "src", "test", "stub", "history", "choices_1761211686430.json");
        const jsonChoiceString = await fs.readFile(stubFilePath, "utf-8");
        const jsonChoice = JSON.parse(jsonChoiceString);
        originalJsonChoice = jsonChoice;
        originalShowHistory =
            `rootPath: /Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c

|__latent_entropy struct task_struct *copy_process(
|f1c8e32

   |copy_mm
   |c2bc4ce

      |dup_mm
      |9ae1216

         |allocate_mm
         |8035326

         |dup_mmap
         |eed5238

            |__mt_dup
            |a5416cd

            |vm_area_dup
            |ac9acc6

            |copy_page_range
            |84ee1bb

               |copy_p4d_range
               |5282cdb

                  |copy_pud_range
                  |27b1b2f

                  |p4d_alloc
                  |374bf6c

                  |p4d_offset
                  |0ed0642

                  |p4d_none_or_clear_bad
                  |303d2ae

                  |p4d_addr_end
                  |525ded4

               |copy_hugetlb_page_range
               |f074bba

               |vma_needs_copy
               |7f7670c

               |is_cow_mapping
               |e4edae9

               |pgd_offset
               |a8ee270

            |anon_vma_fork
            |a029ec6

            |dup_mm_exe_file
            |112d89b

         |mm_init
         |3badfdf

         |memcpy
         |2ecb447

         |get_mm_rss
         |ece1548

      |mmget
      |9dfc1b4

      |sched_mm_cid_fork
      |f8ec891

   |dup_task_struct
   |bb62b34

   |mm_clear_owner
   |9922f8b

   |mmput
   |dde956f

`
    });
    // overWriteChoiceTree & getChoiceTree
    test('overWriteChoiceTree & getChoiceTree', async () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        assert.strictEqual(history.getChoiceTree(), originalJsonChoice);
    });
    // showHistory
    test('showHistory', async () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    // searchTreeByIdPublic
    test('searchTreeByIdPublic to the node which you have been through', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("c2bc4ce");
        assert.strictEqual(false, searchResult === null);
        // searchResultがnullでないのをチェック済み
        assert.strictEqual(JSON.stringify([{ depth: 0, width: 0 }, { depth: 1, width: 0 }]), JSON.stringify(searchResult?.pos));
        assert.strictEqual("retval = copy_mm(clone_flags, p);", searchResult?.processChoice?.functionCodeLine);
        assert.strictEqual("copy_mm", searchResult?.processChoice?.functionName);
        assert.strictEqual("/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c", searchResult?.processChoice?.originalFilePath);
        assert.strictEqual("c2bc4ce3db24d5ab0f911785", searchResult?.processChoice?.id);
        assert.strictEqual(true, !!searchResult?.processChoice?.functionCodeContent);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    test('searchTreeByIdPublic to the node which you have not been through', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("8035326");
        assert.strictEqual(false, searchResult === null);
        // searchResultがnullでないのをチェック済み
        assert.strictEqual("mm = allocate_mm();", searchResult?.processChoice?.functionCodeLine);
        assert.strictEqual("allocate_mm", searchResult?.processChoice?.functionName);
        assert.strictEqual("/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c", searchResult?.processChoice?.originalFilePath);
        assert.strictEqual("8035326fac1a5d881fffc560", searchResult?.processChoice?.id);
        assert.strictEqual(undefined, searchResult?.processChoice?.functionCodeContent);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    test('searchTreeByIdPublic to the node which does not exist', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("1111111");
        assert.strictEqual(true, searchResult === null);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    // moveById
    test('moveById to the node which you have been through', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("c2bc4ce");
        assert.strictEqual(false, searchResult === null);
        const movedSearchResult = history.moveById("c2bc4ce");
        assert.strictEqual(false, movedSearchResult === null);
        assert.strictEqual("copy_mm", movedSearchResult?.functionName);
        assert.strictEqual("static int copy_mm(unsigned long clone_flags, struct task_struct *tsk)\n{\n\tstruct mm_struct *mm, *oldmm;\n\n\ttsk->min_flt = tsk->maj_flt = 0;\n\ttsk->nvcsw = tsk->nivcsw = 0;\n#ifdef CONFIG_DETECT_HUNG_TASK\n\ttsk->last_switch_count = tsk->nvcsw + tsk->nivcsw;\n\ttsk->last_switch_time = 0;\n#endif\n\n\ttsk->mm = NULL;\n\ttsk->active_mm = NULL;\n\n\t/*\n\t * Are we cloning a kernel thread?\n\t *\n\t * We need to steal a active VM for that..\n\t */\n\toldmm = current->mm;\n\tif (!oldmm)\n\t\treturn 0;\n\n\tif (clone_flags & CLONE_VM) {\n\t\tmmget(oldmm);\n\t\tmm = oldmm;\n\t} else {\n\t\tmm = dup_mm(tsk, current->mm);\n\t\tif (!mm)\n\t\t\treturn -ENOMEM;\n\t}\n\n\ttsk->mm = mm;\n\ttsk->active_mm = mm;\n\tsched_mm_cid_fork(tsk);\n\treturn 0;\n}", movedSearchResult?.functionCodeContent);
        assert.strictEqual("retval = copy_mm(clone_flags, p);", movedSearchResult?.functionCodeLine);
        assert.strictEqual("/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c", movedSearchResult?.originalFilePath);
        assert.strictEqual("c2bc4ce3db24d5ab0f911785", movedSearchResult?.id);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    test('moveById to the node which you have not been through', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("8035326");
        assert.strictEqual(false, searchResult === null);
        const movedSearchResult = history.moveById("8035326");
        assert.strictEqual(false, movedSearchResult === null);
        assert.strictEqual("allocate_mm", movedSearchResult?.functionName);
        assert.strictEqual(undefined, movedSearchResult?.functionCodeContent);
        assert.strictEqual("mm = allocate_mm();", movedSearchResult?.functionCodeLine);
        assert.strictEqual("/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c", movedSearchResult?.originalFilePath);
        assert.strictEqual("8035326fac1a5d881fffc560", movedSearchResult?.id);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });

    test('moveById to the node which does not exist', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("1111111");
        assert.strictEqual(true, searchResult === null);
        const movedSearchResult = history.moveById("1111111");
        assert.strictEqual(movedSearchResult, null);
        // history check
        assert.strictEqual(history.showHistory(), originalShowHistory);
    });
    // getContentFromPos
    test('getContentFromPos for correct pos', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const searchResult = history.searchTreeByIdPublic("27b1b2f");
        const expectedSearchPosResult = [
            {
                depth: 0,
                width: 0
            },
            {
                depth: 1,
                width: 0
            },
            {
                depth: 2,
                width: 0
            },
            {
                depth: 3,
                width: 1
            },
            {
                depth: 4,
                width: 2
            },
            {
                depth: 5,
                width: 0
            },
            {
                depth: 6,
                width: 0
            }
        ]
        assert.strictEqual(JSON.stringify(searchResult?.pos), JSON.stringify(expectedSearchPosResult));
        const getContentFromPosResult = history.getContentFromPos(expectedSearchPosResult);
        assert.strictEqual(getContentFromPosResult?.id, "27b1b2fc0ca4580fccf96d67");
        assert.strictEqual(getContentFromPosResult?.functionName, "copy_pud_range");
        assert.strictEqual(getContentFromPosResult?.originalFilePath, "/Users/kazuyakurihara/Documents/open_source/linux/linux/mm/memory.c");
        assert.strictEqual(getContentFromPosResult?.functionCodeLine, "if (copy_pud_range(dst_vma, src_vma, dst_p4d, src_p4d,");
    });
    test('getContentFromPos for incorrect pos', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const expectedSearchPosResult = [{depth:0, width: 10}, {depth: 1, width: 10}];
        const getContentFromPosResult = history.getContentFromPos(expectedSearchPosResult);
        assert.strictEqual(getContentFromPosResult, null);
    });
    // choose
    test('choose for correct choices chain', () => {
        const history = new HistoryHandler(
            "/Users/kazuyakurihara/Documents/open_source/linux/linux/kernel/fork.c",
            "__latent_entropy struct task_struct *copy_process(",
            "__latent_entropy struct task_struct *copy_process(",
            ""
        );
        history.overWriteChoiceTree(originalJsonChoice);
        const expectedCurrentChoicePosition1 = [
            {
                depth: 0,
                width: 0
            },
            {
                depth: 1,
                width: 0
            },
            {
                depth: 2,
                width: 0
            },
            {
                depth: 3,
                width: 1
            },
            {
                depth: 4,
                width: 2
            }
        ]
        history.moveById("84ee1bb");
        const currentChoicePosition1 = history.getCurrentChoicePosition();
        assert.strictEqual(JSON.stringify(currentChoicePosition1), JSON.stringify(expectedCurrentChoicePosition1));
        history.choose(0, "");
        const currentChoicePosition2 = history.getCurrentChoicePosition();
        const expectedCurrentChoicePosition2 = [
            {
                depth: 0,
                width: 0
            },
            {
                depth: 1,
                width: 0
            },
            {
                depth: 2,
                width: 0
            },
            {
                depth: 3,
                width: 1
            },
            {
                depth: 4,
                width: 2
            },
            {
                depth: 5,
                width: 0
            }
        ]
        assert.strictEqual(JSON.stringify(currentChoicePosition2), JSON.stringify(expectedCurrentChoicePosition2));
    })
});
